import React, { useCallback, useEffect, useState } from 'react';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import { FormControl } from '@material-ui/core';
import { useVariablesDataByTemplate } from '../../hooks/use-variables-data-by-template';
import { Progress } from '@backstage/core-components';
import { ErrorContainer } from '../common/error-container';
import { Env0Card } from '../common/env0-card';

import { z } from 'zod';
import type { Variable } from '../../api/types';
import { Env0VariableField } from './env0-variable-field';

const variableSchema = (zImpl: typeof z) =>
  zImpl
    .object({
      name: zImpl.string(),
      value: zImpl.string().optional(),
    })
    .passthrough();

const Env0VariableInputFieldSchema = makeFieldSchema({
  output: zImpl => zImpl.array(variableSchema(zImpl)),
  uiOptions: zImpl => zImpl.object({}),
});

export const Env0VariableInputSchema = Env0VariableInputFieldSchema.schema;

type PassedFormContextFields = {
  formData: {
    env0_project_id?: string;
    env0_template_id?: string;
  };
};

type Env0TemplateSelectorFieldProps =
  typeof Env0VariableInputFieldSchema.TProps;

const shouldShowVariable = (variable: Variable) =>
  !(variable.isReadonly || variable.isOutput);

export const Env0VariablesInput = ({
  formData = [],
  formContext,
  rawErrors,
  onChange: onVariablesChange,
}: Env0TemplateSelectorFieldProps): React.ReactElement => {
  const {
    formData: { env0_project_id: projectId, env0_template_id: templateId },
  } = formContext as PassedFormContextFields;

  const [variables, setVariables] = useState<Variable[]>(
    formData as Variable[],
  );

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
  } = useVariablesDataByTemplate(templateId, projectId);

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
  );
};
