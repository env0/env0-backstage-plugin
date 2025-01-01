import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Env0VariableField } from './env0-variable-field';
import type { Variable } from '../../api/types';
import jestPreview from 'jest-preview';

describe('Env0VariableField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultVariable: Variable = {
    id: 'test-1',
    name: 'TEST_VAR',
    value: 'test-value',
    scope: 'ENVIRONMENT',
  };

  const renderComponent = (props = {}) => {
    const onVariableUpdated = jest.fn();
    const variable = { ...defaultVariable, ...props };
    return {
      onVariableUpdated,
      ...render(
        <Env0VariableField
          variable={variable}
          onVariableUpdated={onVariableUpdated}
        />,
      ),
    };
  };

  it('handles sensitive variables correctly', async () => {
    const { onVariableUpdated } = renderComponent({
      isSensitive: true,
      value: '********',
    });

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'new-secret');

    expect(onVariableUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        isSensitive: true,
      }),
      'new-secret',
      true,
    );
  });

  it('validates regex correctly', () => {
    renderComponent({
      value: 'abc123',
      regex: '^[a-z0-9]+$',
    });

    expect(screen.queryByText(/does not match regex/i)).not.toBeInTheDocument();

    renderComponent({
      value: 'ABC',
      regex: '^[a-z0-9]+$',
    });

    expect(screen.getByText(/does not match regex/i)).toBeInTheDocument();
  });

  it('handles dropdown variables correctly', async () => {
    const schema = {
      enum: ['option1', 'option2', 'option3'],
    };

    renderComponent({
      schema,
      value: 'option1',
    });

    const select = screen.getByRole('button');
    await userEvent.click(select);
    jestPreview.debug();
    expect(select).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
});
