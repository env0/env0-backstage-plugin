import React, { useCallback, useEffect, useState } from 'react';
import type { Variable } from '../../api/types';
import { useVariablesDataByTemplate } from '../../hooks/use-variables-data-by-template';
import { Env0Card } from '../common/env0-card';
import { Progress } from '@backstage/core-components';
import { ErrorContainer } from '../common/error-container';
import { FormControl } from '@material-ui/core';
import { Env0VariableField } from './env0-variable-field';

const shouldShowVariable = (variable: Variable) =>
  !(variable.isReadonly || variable.isOutput);

export type Env0VariablesInputProps = {
  projectId?: string;
  templateId?: string;
  environmentId?: string;
  onVariablesChange: (update: Variable[]) => void;
  rawErrors: string[];
  initialVariables: Variable[];
};

export const Env0VariablesInput = ({
  projectId,
  templateId,
  environmentId,
  onVariablesChange,
  rawErrors,
  initialVariables,
}: Env0VariablesInputProps) => {
  const [variables, setVariables] = useState<Variable[]>(initialVariables);

  const onVariablesChangeCallback = useCallback(
    (newVariables: Variable[]) => {
      onVariablesChange(newVariables);
      setVariables(newVariables);
    },
    [onVariablesChange],
  );

  const [isInitialized, setIsInitialized] = useState(false);

  const {
    loading,
    error,
    value: variablesData,
    retry,
  } = useVariablesDataByTemplate(templateId, projectId, environmentId);

  useEffect(() => {
    if (variablesData && !isInitialized) {
      onVariablesChangeCallback(variablesData);
      setIsInitialized(true);
    }
  }, [isInitialized, onVariablesChangeCallback, variablesData]);

  const updateVariableValue = (updatedVariable: Variable, value: string) => {
    const newVariables = [...variables];
    const updatedVariableIndex = newVariables.findIndex(
      variable => variable.id === updatedVariable.id,
    );
    newVariables[updatedVariableIndex] = {
      ...updatedVariable,
      value,
    };
    onVariablesChangeCallback(newVariables);
  };

  if (loading) {
    return (
      <Env0Card title="env0" retryAction={retry}>
        <Progress />
      </Env0Card>
    );
  }

  if (error) {
    return (
      <Env0Card title="env0" retryAction={retry}>
        <ErrorContainer error={error} />
      </Env0Card>
    );
  }

  return (
    <Env0Card title="env0" retryAction={retry}>
      <FormControl margin="normal" error={Boolean(rawErrors?.length)} fullWidth>
        {variables.map(
          variable =>
            shouldShowVariable(variable) && (
              <Env0VariableField
                key={variable.id}
                variable={variable}
                onVariableUpdated={updateVariableValue}
              />
            ),
        )}
      </FormControl>
    </Env0Card>
  );
};
