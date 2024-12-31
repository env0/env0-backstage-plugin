import React from 'react';
import { screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Env0EnvironmentDetailsCard } from './env0-environment-details-card';
import { Env0Api, env0ApiRef } from '../../api';
import { defaultEnv0Mocks } from '../common/test-handlers.utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { ENV0_ENVIRONMENT_ANNOTATION } from '../common/is-plugin-available';
import userEvent from '@testing-library/user-event';
import { Environment, Template } from '../../api/types';

const mockEnvironment: Environment = {
  id: 'env-123',
  name: 'Test Environment',
  status: 'ACTIVE',
  driftStatus: 'OK',
  projectId: 'proj-1',
  organizationId: 'org-1',
  workspaceName: 'test-workspace',
  resources: [
    {
      provider: 'aws',
      type: 'aws_s3_bucket',
      name: 'test-bucket',
      moduleName: 'bucket',
    },
  ],
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
    resourceCount: 1,
    startedAt: new Date('2024-01-01'),
    finishedAt: new Date('2024-01-01'),
    blueprintId: 'template-1',
    blueprintRepository: 'https://github.com/org/repo',
    blueprintRevision: 'main',
  },
};

const mockTemplate: Template = {
  id: 'template-1',
  name: 'Test Template',
  repository: 'https://github.com/org/repo',
  type: 'terraform',
  projectIds: ['proj-1'],
  organizationId: 'org-1',
};

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'test-component',
    annotations: {
      [ENV0_ENVIRONMENT_ANNOTATION]: 'env-123',
    },
  },
};

const getEnvironmentByIdMock = jest.fn();
const getTemplateByIdMock = jest.fn();

const mockedEnv0Api: Partial<Env0Api> = {
  ...defaultEnv0Mocks,
  getEnvironmentById: getEnvironmentByIdMock,
  getTemplateById: getTemplateByIdMock,
};

describe('Env0EnvironmentDetailsCard', () => {
  const renderComponent = async () => {
    return renderInTestApp(
      <TestApiProvider apis={[[env0ApiRef, mockedEnv0Api]]}>
        <EntityProvider entity={mockEntity}>
          <Env0EnvironmentDetailsCard />
        </EntityProvider>
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getEnvironmentByIdMock.mockResolvedValue(mockEnvironment);
    getTemplateByIdMock.mockResolvedValue(mockTemplate);
  });

  it('renders loading state while fetching data', async () => {
    getEnvironmentByIdMock.mockImplementation(() => new Promise(() => {}));

    await renderComponent();

    expect(await screen.findByTestId('progress')).toBeInTheDocument();
  });

  it('renders error state when API calls fail', async () => {
    const errorMessage = 'Test error';
    getEnvironmentByIdMock.mockRejectedValue(new Error(errorMessage));

    await renderComponent();

    expect(await screen.findByText(/Test error/i)).toBeInTheDocument();
  });

  it('renders error when environment ID is empty', async () => {
    const entityWithoutEnvId: Entity = {
      ...mockEntity,
      metadata: {
        name: 'test-component',
        annotations: {},
      },
    };

    await renderInTestApp(
      <TestApiProvider apis={[[env0ApiRef, mockedEnv0Api]]}>
        <EntityProvider entity={entityWithoutEnvId}>
          <Env0EnvironmentDetailsCard />
        </EntityProvider>
      </TestApiProvider>,
    );

    expect(
      await screen.findByText(/Entity's Environment ID is empty/i),
    ).toBeInTheDocument();
  });

  it('displays environment metadata correctly', async () => {
    await renderComponent();

    expect(await screen.findByText('Test Environment')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText('test-workspace')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // resources length
  });

  it('renders GitHub repository link correctly', async () => {
    await renderComponent();

    const repoLink = await screen.findByRole('link', { name: /org\/repo/i });
    expect(repoLink).toHaveAttribute('href', 'https://github.com/org/repo');
  });

  it('generates correct env0 environment URL', async () => {
    await renderComponent();

    const env0Link = await screen.findByRole('link', { name: /Open in env0/i });
    expect(env0Link).toHaveAttribute(
      'href',
      'https://app.env0.com/p/proj-1/environments/env-123',
    );
  });

  it('retries data fetching when retry button is clicked', async () => {
    getEnvironmentByIdMock
      .mockRejectedValueOnce(new Error('Test error'))
      .mockResolvedValueOnce(mockEnvironment);

    await renderComponent();

    const retryButton = await screen.findByTestId('retry-button');
    await userEvent.click(retryButton);

    expect(await screen.findByText('Test Environment')).toBeInTheDocument();
    expect(getEnvironmentByIdMock).toHaveBeenCalledTimes(2);
  });
});
