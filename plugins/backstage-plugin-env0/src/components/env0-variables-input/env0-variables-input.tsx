import React, { useEffect, useState } from 'react';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import {
  FormControl,
  FormHelperText,
  styled,
  TextField,
  Typography,
} from '@material-ui/core';
import { z } from 'zod';
import { Variable } from '../../api/types';
import { useVariablesDataByTemplate } from '../../hooks/use-variables-data-by-template';
import { Progress } from '@backstage/core-components';
import { ErrorContainer } from '../common/error-container';
import { Env0Card } from '../common/env0-card';

const variableSchema = (zImpl: typeof z) =>
  zImpl
    .object({
      name: zImpl.string(),
      value: zImpl.string().optional(),
    })
    .passthrough();

const Env0VariableInputFieldSchema = makeFieldSchema({
  output: zImpl => zImpl.array(variableSchema(z)),
  uiOptions: zImpl => zImpl.object({}),
});

export const Env0VariableInputSchema = Env0VariableInputFieldSchema.schema;

type PassedUIOptionsFields = {
  templateId: string;
  projectId: string;
};

type Env0TemplateSelectorFieldProps =
  typeof Env0VariableInputFieldSchema.TProps & PassedUIOptionsFields;

const VariableContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
}));

export const Env0VariablesInput = ({
  formData = [],
  required,
  rawErrors,
  onChange: onVariablesChange,
  templateId,
  projectId,
}: Env0TemplateSelectorFieldProps): React.ReactElement => {
  const [variables, setVariables] = useState<Variable[]>(
    formData as Variable[],
  );

  const {
    loading,
    error,
    value: variablesData,
  } = useVariablesDataByTemplate(templateId, projectId);

  useEffect(() => {
    if (variablesData) {
      setVariables(variablesData);
    }
  }, [variablesData]);

  if (loading) {
    return (
      <Env0Card>
        <Progress />
      </Env0Card>
    );
  }

  if (error) {
    return (
      <Env0Card>
        <ErrorContainer error={error} />
      </Env0Card>
    );
  }

  const updateVariableValue = (index: number, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = { ...newVariables[index], value };
    setVariables(newVariables);
    onVariablesChange(newVariables);
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={Boolean(rawErrors?.length)}
      fullWidth
    >
      <FormHelperText>Env0 Variables Input</FormHelperText>
      {variables.map((variable, index) => (
        <VariableContainer key={index}>
          <Typography
            variant="body1"
            style={{
              marginRight: '10px',
              minWidth: '150px',
              fontWeight: 'bold',
            }}
          >
            {variable.name}:
          </Typography>
          <TextField
            label="Value"
            value={variable.value}
            onChange={(changeEvent: any) =>
              updateVariableValue(index, changeEvent.target.value)
            }
          />
        </VariableContainer>
      ))}
    </FormControl>
  );
};
