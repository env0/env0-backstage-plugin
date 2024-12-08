import React from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, Template } from '../../api/types';
import { env0ApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsyncRetry';

export const Env0StepTemplateSelector = ({
  onChange: onTemplateIdChange,
  schema,
  rawErrors,
  required,
  formData: selectedTemplateId,
}: FieldExtensionComponentProps<string>) => {
  const api = useApi<Env0Api>(env0ApiRef);

  const { value } = useAsync(async () => {
    const templates = await api.getTemplatesByOrganizationId(
      'bde19c6d-d0dc-4b11-a951-8f43fe49db92',
    );
    const deployableTemplates = templates.filter(
      template =>
        ![
          'module',
          'approval-policy',
          'custom-flow',
          'environment-discovery',
        ].includes(template.type),
    );
    return {
      templates: deployableTemplates,
    };
  });
  const templates = value?.templates || [];
  return (
    <FormControl
      margin="normal"
      required={required}
      error={Boolean(rawErrors?.length)}
    >
      <Autocomplete<Template>
        getOptionLabel={option => option.name}
        options={templates || []}
        value={templates.find(t => t.id === selectedTemplateId) || null}
        onChange={(_, newValue: Template | null) => {
          onTemplateIdChange(newValue?.id);

        }}
        renderInput={params => (
          <TextField
            {...params}
            label={required ? `${schema.title}*` : schema.title}
            aria-describedby="entityName"
          />
        )}
      />
      <FormHelperText id="entityName">
        Select from the list of available env0 templates
      </FormHelperText>
    </FormControl>
  );
};