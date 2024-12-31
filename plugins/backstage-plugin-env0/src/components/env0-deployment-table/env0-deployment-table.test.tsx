import React from 'react';
import { screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Env0DeploymentTable } from './env0-deployment-table';
import { Env0Api, env0ApiRef } from '../../api';
import { defaultEnv0Mocks } from '../common/test-handlers.utils';
import { Deployment, Environment } from '../../api/types';
import userEvent from '@testing-library/user-event';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { ENV0_ENVIRONMENT_ANNOTATION } from '../common/is-plugin-available';

const mockDeployments: Deployment[] = [
  {
    id: 'deploy-1',
    type: 'deploy',
    status: 'SUCCESS',
    planSummary: { added: 1, changed: 0, destroyed: 0 },
    resourceCount: 2,
    startedAt: new Date('2024-01-01T10:00:00Z'),
    finishedAt: new Date('2024-01-01T10:30:00Z'),
    blueprintId: 'template-1',
    blueprintRepository: 'https://github.com/org/repo',
    blueprintRevision: 'main',
  },
  {
    id: 'deploy-2',
    type: 'destroy',
    status: 'FAILURE',
    planSummary: { added: 0, changed: 0, destroyed: 1 },
    resourceCount: 1,
    startedAt: new Date('2024-01-02T10:00:00Z'),
    finishedAt: new Date('2024-01-02T10:15:00Z'),
    blueprintId: 'template-1',
    blueprintRepository: 'https://github.com/org/repo',
    blueprintRevision: 'main',
  },
];

const envId = 'env-123';

const mockEnvironment: Environment = {
  id: envId,
  name: 'Test Environment',
  status: 'ACTIVE',
  driftStatus: 'OK',
  projectId: 'proj-1',
  organizationId: 'org-1',
  workspaceName: 'test-workspace',
  user: {
    name: 'Test User',
    email: 'test@example.com',
    user_id: 'user-1',
    given_name: 'Test',
    family_name: 'User',
  },
  latestDeploymentLog: {
    id: 'deploy-1',
    type: 'deploy',
    status: 'SUCCESS',
    planSummary: { added: 1, changed: 0, destroyed: 0 },
    resourceCount: 2,
    startedAt: new Date('2024-01-01T10:00:00Z'),
    finishedAt: new Date('2024-01-01T10:30:00Z'),
    blueprintId: 'template-1',
    blueprintRepository: 'https://github.com/org/repo',
    blueprintRevision: 'main',
  },
};

const mockEnvironmentWithError: Environment = {
  ...mockEnvironment,
  latestDeploymentLog: {
    ...mockEnvironment.latestDeploymentLog,
    error: new Error('Test deployment error'),
  },
};

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'test-component',
    annotations: {
      [ENV0_ENVIRONMENT_ANNOTATION]: envId,
    },
  },
};

const listDeploymentsMock = jest.fn();
const getEnvironmentByIdMock = jest.fn();

const mockedEnv0Api: Partial<Env0Api> = {
  ...defaultEnv0Mocks,
  listDeployments: listDeploymentsMock,
  getEnvironmentById: getEnvironmentByIdMock,
};

describe('Env0DeploymentTable', () => {
  const renderComponent = async () => {
    return renderInTestApp(
      <TestApiProvider apis={[[env0ApiRef, mockedEnv0Api]]}>
        <EntityProvider entity={mockEntity}>
          <Env0DeploymentTable environmentId="env-123" />
        </EntityProvider>
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    listDeploymentsMock.mockResolvedValue(mockDeployments);
    getEnvironmentByIdMock.mockResolvedValue(mockEnvironment);
  });

  it('renders loading state while fetching data', async () => {
    listDeploymentsMock.mockImplementation(() => new Promise(() => {}));

    await renderComponent();

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state when API calls fail', async () => {
    const errorMessage = 'Test error';
    listDeploymentsMock.mockRejectedValue(new Error(errorMessage));

    await renderComponent();

    expect(await screen.findByText(/Test error/i)).toBeInTheDocument();
  });

  it('displays deployment history in table', async () => {
    await renderComponent();

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2024, 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('00:30:00')).toBeInTheDocument();
  });

  it('shows deployment error when present', async () => {
    getEnvironmentByIdMock.mockResolvedValue(mockEnvironmentWithError);

    await renderComponent();

    expect(
      await screen.findByText('Test deployment error'),
    ).toBeInTheDocument();
  });

  it('retries data fetching when retry button is clicked', async () => {
    listDeploymentsMock
      .mockResolvedValueOnce([])
      .mockResolvedValue(mockDeployments);

    await renderComponent();

    const retryButton = await screen.findByTestId('retry-button');
    await userEvent.click(retryButton);

    expect(await screen.findByText('Success')).toBeInTheDocument();
    expect(listDeploymentsMock).toHaveBeenCalledTimes(2);
  });

  it('enables redeploy button when deployments exist', async () => {
    await renderComponent();

    const redeployButton = await screen.findByTestId('redeploy-button');
    expect(redeployButton).not.toBeDisabled();
  });

  it('disables redeploy button when no deployments exist', async () => {
    listDeploymentsMock.mockResolvedValue([]);

    await renderComponent();

    const redeployButton = await screen.findByTestId('redeploy-button');
    expect(redeployButton).toBeDisabled();
  });

  it('displays N/A when plan summary is missing', async () => {
    const deploymentsWithoutSummary = [
      {
        ...mockDeployments[0],
        planSummary: undefined,
      },
    ];
    listDeploymentsMock.mockResolvedValue(deploymentsWithoutSummary);

    await renderComponent();

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('shows - for duration when dates are missing', async () => {
    const deploymentsWithoutDates = [
      {
        ...mockDeployments[0],
        startedAt: undefined,
        finishedAt: undefined,
      },
    ];
    listDeploymentsMock.mockResolvedValue(deploymentsWithoutDates);

    await renderComponent();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
