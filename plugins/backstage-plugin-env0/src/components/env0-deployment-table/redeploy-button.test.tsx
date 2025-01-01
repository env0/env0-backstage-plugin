import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RedeployButton } from './redeploy-button';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Env0Api, env0ApiRef } from '../../api';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { ENV0_ENVIRONMENT_ANNOTATION } from '../common/is-plugin-available';
import { defaultEnv0Mocks } from '../common/test-handlers.utils';

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

const mockEnvironmentData = {
  projectId: 'proj-123',
  latestDeploymentLog: {
    blueprintId: 'template-123',
  },
};

const getEnvironmentByIdMock = jest.fn();
const redeployEnvironmentMock = jest.fn();
const listVariablesMock = jest.fn();

const mockedEnv0Api: Partial<Env0Api> = {
  ...defaultEnv0Mocks,
  getEnvironmentById: getEnvironmentByIdMock,
  redeployEnvironment: redeployEnvironmentMock,
  listVariables: listVariablesMock,
};

const editVariable = async (variableId: string, value: string) => {
  const variablesInput = await screen.findByTestId('env0-variables-input');
  const testVarField = await within(variablesInput).findByTestId(
    `${variableId}-variable-field`,
  );
  const input = within(testVarField).getByRole('textbox');
  await userEvent.clear(input);
  await userEvent.type(input, value);
};

describe('RedeployButton', () => {
  const renderComponent = async (props = {}) => {
    return renderInTestApp(
      <TestApiProvider apis={[[env0ApiRef, mockedEnv0Api]]}>
        <EntityProvider entity={mockEntity}>
          <RedeployButton {...props} />
        </EntityProvider>
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getEnvironmentByIdMock.mockResolvedValue(mockEnvironmentData);
    redeployEnvironmentMock.mockResolvedValue({});
    listVariablesMock.mockResolvedValue([]);
  });

  it('should render deploy button', async () => {
    await renderComponent();

    const redeployButton = await screen.findByTestId('redeploy-button');
    expect(redeployButton).toBeInTheDocument();
    expect(redeployButton).not.toBeDisabled();
  });

  it('shows loading state while fetching environment data', async () => {
    getEnvironmentByIdMock.mockImplementation(() => {
      return new Promise(() => {});
    });

    await renderComponent();

    const redeployButton = await screen.findByTestId('redeploy-button');
    expect(redeployButton).toHaveTextContent(/Loading/i);
    expect(redeployButton).toBeDisabled();
  });

  it('shows error state when environment fetch fails', async () => {
    getEnvironmentByIdMock.mockRejectedValue(new Error('Failed to fetch data'));
    await renderComponent();

    const redeployButton = await screen.findByTestId('redeploy-button');
    expect(redeployButton).toHaveTextContent(/Error/i);
    expect(redeployButton).toBeDisabled();
    expect(screen.getByLabelText(/Failed to fetch data/i)).toBeInTheDocument();
  });

  it('opens modal when deploy button is clicked', async () => {
    await renderComponent();

    const redeployButton = await screen.findByTestId('redeploy-button');
    await userEvent.click(redeployButton);

    expect(await screen.findByTestId('redeploy-modal')).toBeInTheDocument();
    expect(
      await screen.findByTestId('redeploy-cancel-button'),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId('redeploy-run-button'),
    ).toBeInTheDocument();
  });

  it('should disable the redeploy button when disabled prop is passed', async () => {
    await renderComponent({ disabled: true });

    const button = await screen.findByTestId('redeploy-button');
    expect(button).toBeDisabled();
  });

  describe(`Redeploy modal`, () => {
    it('closes modal when cancel is clicked', async () => {
      await renderComponent();

      const redeployButton = await screen.findByTestId('redeploy-button');
      await userEvent.click(redeployButton);
      const cancelButton = await screen.findByTestId('redeploy-cancel-button');
      await userEvent.click(cancelButton);

      expect(screen.queryByTestId('redeploy-modal')).not.toBeInTheDocument();
    });

    it('should show success snackbar and call afterDeploy logic on successfully deploy', async () => {
      const afterDeploy = jest.fn();
      await renderComponent({ afterDeploy });

      const redeployButton = await screen.findByTestId('redeploy-button');
      await userEvent.click(redeployButton);
      const deployButton = await screen.findByTestId('redeploy-run-button');
      await userEvent.click(deployButton);

      await waitFor(() => {
        expect(
          screen.getByText(/env0 deployment initiated successfully/i),
        ).toBeInTheDocument();
      });
      expect(afterDeploy).toHaveBeenCalled();
    });

    it('should show failure snackbar on failed deployment', async () => {
      redeployEnvironmentMock.mockRejectedValue(new Error('Failed to deploy'));
      await renderComponent();

      const redeployButton = await screen.findByTestId('redeploy-button');
      await userEvent.click(redeployButton);
      const deployButton = await screen.findByTestId('redeploy-run-button');
      await userEvent.click(deployButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to trigger env0 deployment/i),
        ).toBeInTheDocument();
      });
    });

    it('should show loading state when deployment is in progress', async () => {
      redeployEnvironmentMock.mockImplementation(() => {
        return new Promise(() => {});
      });
      await renderComponent();

      const redeployButton = await screen.findByTestId('redeploy-button');
      await userEvent.click(redeployButton);
      const deployButton = await screen.findByTestId('redeploy-run-button');
      await userEvent.click(deployButton);

      expect(deployButton).toHaveTextContent(/Loading/i);
      expect(deployButton).toBeDisabled();
    });

    it('should show env0 variables input', async () => {
      await renderComponent();

      const redeployButton = await screen.findByTestId('redeploy-button');
      await userEvent.click(redeployButton);

      expect(
        await screen.findByTestId('env0-variables-input'),
      ).toBeInTheDocument();
    });

    it('should pass changed variables to redeployEnvironment', async () => {
      const testVariableId = 'var-123';
      const testVariableValue = 'test-value';
      listVariablesMock.mockResolvedValue([
        {
          id: testVariableId,
          name: 'test-var',
          value: testVariableValue,
          scope: 'ENVIRONMENT',
          scopeId: 'set-123',
        },
      ]);
      await renderComponent();

      const redeployButton = await screen.findByTestId('redeploy-button');
      await userEvent.click(redeployButton);
      await editVariable(testVariableId, 'new-value');
      await userEvent.click(await screen.findByTestId('redeploy-run-button'));

      expect(redeployEnvironmentMock).toHaveBeenCalledWith(
        'env-123',
        expect.arrayContaining([
          expect.objectContaining({
            id: testVariableId,
            value: 'new-value',
          }),
        ]),
      );
    });
  });

  describe(`Form validations`, () => {
    describe(`Required variable validation error`, () => {
      const requiredVariableName = 'required-var';

      beforeEach(async () => {
        listVariablesMock.mockResolvedValue([
          {
            id: 'var-123',
            name: requiredVariableName,
            value: '',
            isRequired: true,
            scope: 'ENVIRONMENT',
          },
        ]);
        await renderComponent();

        const redeployButton = await screen.findByTestId('redeploy-button');
        await userEvent.click(redeployButton);
        const deployButton = await screen.findByTestId('redeploy-run-button');
        await userEvent.click(deployButton);
      });

      it('should show validation errors when required field is empty', async () => {
        expect(
          screen.getByText(`Variable "${requiredVariableName}" is required`),
        ).toBeInTheDocument();
        expect(redeployEnvironmentMock).not.toHaveBeenCalled();
      });

      it('should clear validation errors when modal is closed and reopened', async () => {
        expect(
          screen.getByText(`Variable "${requiredVariableName}" is required`),
        ).toBeInTheDocument();

        await userEvent.click(
          await screen.findByTestId('redeploy-cancel-button'),
        );
        await userEvent.click(await screen.findByTestId('redeploy-button'));

        expect(
          screen.queryByText(`Variable "${requiredVariableName}" is required`),
        ).not.toBeInTheDocument();
      });
    });

    describe(`Regex validations`, () => {
      const regexVariableId = 'var-123';
      const regexVariableName = 'regex-var';

      beforeEach(async () => {
        listVariablesMock.mockResolvedValue([
          {
            id: regexVariableId,
            name: regexVariableName,
            value: '',
            regex: '^[0-3][0-9]$',
            scope: 'ENVIRONMENT',
          },
        ]);
        await renderComponent();
        const redeployButton = await screen.findByTestId('redeploy-button');
        await userEvent.click(redeployButton);
      });

      it('should show validation errors when regex validation fails', async () => {
        await editVariable(regexVariableId, '25');
        const deployButton = await screen.findByTestId('redeploy-run-button');
        await userEvent.click(deployButton);

        const validationErrors = await screen.findByTestId(
          'redeploy-validation-errors',
        );
        expect(validationErrors).toHaveTextContent(
          `Value for variable "${regexVariableName}" does not match regex: ^[0-3][0-9]$`,
        );
        expect(redeployEnvironmentMock).not.toHaveBeenCalled();
      });

      it('should allow deployment when all validation passes', async () => {
        jestPreview.debug();
        await editVariable(regexVariableId, '25');
        const deployButton = await screen.findByTestId('redeploy-run-button');
        await userEvent.click(deployButton);

        expect(redeployEnvironmentMock).toHaveBeenCalledWith(
          'env-123',
          expect.arrayContaining([
            expect.objectContaining({
              id: regexVariableId,
              value: '25',
            }),
          ]),
        );
      });
    });
  });
});
