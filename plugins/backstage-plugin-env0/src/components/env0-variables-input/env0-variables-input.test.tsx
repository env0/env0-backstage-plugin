import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Env0VariablesInput } from './env0-variables-input';
import { Env0Api, env0ApiRef } from '../../api';
import type { Variable, VariableSet } from '../../api/types';
import { defaultEnv0Mocks } from '../common/test-handlers.utils';

const mockVariables: Variable[] = [
  {
    id: 'var-1',
    name: 'TEST_VAR_1',
    value: 'test-value-1',
    scope: 'ENVIRONMENT',
    scopeId: 'env-123',
  },
  {
    id: 'readonly-2',
    name: 'TEST_VAR_2',
    value: 'test-value-2',
    scope: 'SET',
    scopeId: 'set-123',
    isReadonly: true,
  },
  {
    id: 'set-3',
    name: 'TEST_VAR_3',
    value: 'test-value-3',
    scope: 'SET',
    scopeId: 'set-123',
  },
];

const mockVariableSets: VariableSet = {
  id: 'set-123',
  name: 'Test Variable Set',
  description: 'Test description',
};

const listVariablesMock = jest.fn();
const findVariableSetByIdMock = jest.fn();

const mockedEnv0Api: Partial<Env0Api> = {
  ...defaultEnv0Mocks,
  listVariables: listVariablesMock,
  findVariableSetById: findVariableSetByIdMock,
};

describe('Env0VariablesInput', () => {
  const defaultProps = {
    projectId: 'proj-123',
    templateId: 'template-123',
    environmentId: 'env-123',
    onVariablesFormDataChange: jest.fn(),
    rawErrors: [],
  };

  const renderComponent = async (props = {}) => {
    return renderInTestApp(
      <TestApiProvider apis={[[env0ApiRef, mockedEnv0Api]]}>
        <Env0VariablesInput {...defaultProps} {...props} />
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    listVariablesMock.mockResolvedValue(mockVariables);
    findVariableSetByIdMock.mockResolvedValue(mockVariableSets);
  });

  it('renders loading state while fetching data', async () => {
    listVariablesMock.mockImplementation(() => new Promise(() => {}));
    findVariableSetByIdMock.mockImplementation(() => new Promise(() => {}));

    await renderComponent();

    expect(await screen.findByTestId('progress')).toBeInTheDocument();
  });

  it('renders error state when API calls fail', async () => {
    const errorMessage = 'Test error';
    const testError = new Error(errorMessage);
    listVariablesMock.mockRejectedValue(testError);

    await renderComponent();
    expect(await screen.findByText(/Test error/i)).toBeInTheDocument();
  });

  it('renders editable variables', async () => {
    await renderComponent();

    expect(
      await screen.findByTestId('var-1-variable-field'),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId('readonly-2-variable-field'),
    ).not.toBeInTheDocument();
  });

  it('renders variable sets in collapsed groups', async () => {
    await renderComponent();

    // Find the variable set group
    const setTitle = await screen.findByText('Test Variable Set');
    expect(setTitle).toBeInTheDocument();

    // Click to expand the group
    await userEvent.click(screen.getByLabelText('expand'));

    // Check that the variable in the set is now visible
    expect(
      await screen.findByTestId('set-3-variable-field'),
    ).toBeInTheDocument();
  });

  it('calls onVariablesFormDataChange when variable is edited', async () => {
    const onVariablesFormDataChange = jest.fn();
    await renderComponent({ onVariablesFormDataChange });

    // Find and edit the variable
    const variableField = await screen.findByTestId('var-1-variable-field');
    const input = within(variableField).getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'new-value');

    // Verify callback was called with updated variable
    await waitFor(() => {
      expect(onVariablesFormDataChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'var-1',
            value: 'new-value',
            scope: 'ENVIRONMENT',
            isEdited: true,
          }),
        ]),
      );
    });
  });

  it('preserves original scope when editing variable from set and sets scope as ENVIRONMENT', async () => {
    const onVariablesFormDataChange = jest.fn();
    await renderComponent({ onVariablesFormDataChange });

    const setTitle = await screen.findByLabelText('expand');
    await userEvent.click(setTitle);

    const variableField = await screen.findByTestId('set-3-variable-field');
    const input = within(variableField).getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'new-set-value');

    // Verify the original scope was preserved in the callback
    await waitFor(() => {
      expect(onVariablesFormDataChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'set-3',
            value: 'new-set-value',
            scope: 'ENVIRONMENT',
            originalVariableScope: 'SET',
          }),
        ]),
      );
    });
  });

  it('fetches variables with correct parameters', async () => {
    await renderComponent();

    expect(listVariablesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        blueprintId: 'template-123',
        projectId: 'proj-123',
        environmentId: 'env-123',
      }),
    );
  });

  it('fetches variable sets with correct parameters', async () => {
    await renderComponent();

    expect(findVariableSetByIdMock).toHaveBeenCalledWith('set-123');
  });
});
