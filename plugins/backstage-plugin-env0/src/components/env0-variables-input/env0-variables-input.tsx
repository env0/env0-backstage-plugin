import React, { ReactElement, useEffect, useState } from 'react';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import {
  FormControl,
  Select,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { useVariablesDataByTemplate } from '../../hooks/use-variables-data-by-template';
import { Progress } from '@backstage/core-components';
import { ErrorContainer } from '../common/error-container';
import { Env0Card } from '../common/env0-card';
import InfoRounded from '@material-ui/icons/InfoRounded';

import { z } from 'zod';
import type { Variable } from '../../api/types';

const VariableContainer = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 5fr',
  gridColumnStart: 1,
  gap: '2em',
  alignItems: 'center',
  width: '100%',
  marginBottom: '2em',
}));

const FullWidthSelect = styled(Select)({
  width: '100%',
});

const InputAndInfoIconContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

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

type VaribleType = 'string' | 'dropdown';

type VariableInputComponentProps = {
  variable: Variable;
  index: number;
  updateVariableValue: (index: number, value: string) => void;
};

const variableInputByInputType: Record<
  VaribleType,
  ({
    variable,
    index,
    updateVariableValue,
  }: VariableInputComponentProps) => ReactElement
> = {
  string: ({ variable, index, updateVariableValue }) => (
    <TextField
      label="Value"
      fullWidth
      value={variable.value}
      required={variable.isRequired}
      onChange={(changeEvent: any) =>
        updateVariableValue(index, changeEvent.target.value)
      }
    />
  ),
  dropdown: ({ variable, index, updateVariableValue }) => (
    <FullWidthSelect
      value={variable.value}
      onChange={(changeEvent: any) =>
        updateVariableValue(index, changeEvent.target.value)
      }
    >
      {variable.schema?.enum?.map((option, optionIndex) => (
        <option key={optionIndex} value={option}>
          {option}
        </option>
      ))}
    </FullWidthSelect>
  ),
};

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
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    loading,
    error,
    value: variablesData,
    retry,
  } = useVariablesDataByTemplate(templateId, projectId);

  useEffect(() => {
    if (variablesData && !isInitialized) {
      setVariables(variablesData);
      setIsInitialized(true);
    }
  }, [isInitialized, variablesData]);

  if (loading) {
    return (
      <Env0Card retryAction={retry}>
        <Progress />
      </Env0Card>
    );
  }

  if (error) {
    return (
      <Env0Card retryAction={retry}>
        <ErrorContainer error={error} />
      </Env0Card>
    );
  }

  const updateVariableValue = (index: number, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = {
      ...newVariables[index],
      scope: 'ENVIRONMENT',
      value,
    };
    setVariables(newVariables);
    onVariablesChange(newVariables);
  };

  const getVariableInput = (variable: Variable, index: number) => {
    return variableInputByInputType[
      variable.schema?.enum ? 'dropdown' : 'string'
    ]({
      variable,
      index,
      updateVariableValue,
    });
  };

  return (
    <FormControl margin="normal" error={Boolean(rawErrors?.length)} fullWidth>
      {variables.map(
        (variable, index) =>
          shouldShowVariable(variable) && (
            <VariableContainer key={index}>
              <Typography
                variant="body1"
                style={{
                  minWidth: '150px',
                  fontWeight: 'bold',
                }}
              >
                {variable.name}:
              </Typography>
              <InputAndInfoIconContainer>
                {getVariableInput(variable, index)}
                {variable.description && (
                  <Tooltip title={variable.description}>
                    <InfoRounded />
                  </Tooltip>
                )}
              </InputAndInfoIconContainer>
            </VariableContainer>
          ),
      )}
    </FormControl>
  );
};
