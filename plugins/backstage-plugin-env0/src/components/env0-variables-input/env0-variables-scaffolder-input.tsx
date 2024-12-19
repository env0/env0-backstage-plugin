import React from 'react';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import { z } from 'zod';
import type { Variable } from '../../api/types';
import { Env0VariablesInput } from './env0-variables-input';

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

export const Env0VariablesScaffolderInput = ({
  formContext,
  formData = [],
  rawErrors,
  onChange: onVariablesChange,
}: Env0TemplateSelectorFieldProps): React.ReactElement => {
  const {
    formData: { env0_project_id: projectId, env0_template_id: templateId },
  } = formContext as PassedFormContextFields;
  return (
    <Env0VariablesInput
      {...{
        initialVariables: formData as Variable[],
        onVariablesChange,
        rawErrors,
        projectId,
        templateId,
      }}
    />
  );
};
