import React, { useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, Template } from '../../api/types';
import { env0ApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsyncRetry';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@mui/material/IconButton';

export const Env0TemplateSelector = ({
  onChange: onTemplateIdChange,
  schema,
  rawErrors,
  required,
  formData: selectedTemplateId,
}: FieldExtensionComponentProps<string>) => {
  const api = useApi<Env0Api>(env0ApiRef);
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(true);
  const { value, loading, error } = useAsync(async () => {
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

  if (error) {
    return (
      <Snackbar
        open={isErrorOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setIsErrorOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Failed to load templates from env0. Please try again later.
          {error?.message}
        </Alert>
      </Snackbar>
    );
  }
  return (
    <FormControl
      margin="normal"
      required={required}
      error={Boolean(rawErrors?.length)}
    >
      <Autocomplete<Template>
        loading={loading}
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
