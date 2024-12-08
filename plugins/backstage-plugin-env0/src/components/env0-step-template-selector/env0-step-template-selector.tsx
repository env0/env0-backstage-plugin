import React from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api } from '../../api/types';
import { env0ApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsyncRetry';

export const Env0StepTemplateSelector = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldExtensionComponentProps<string>) => {
  const api = useApi<Env0Api>(env0ApiRef);
  const { value, loading, error } = useAsync(async () => {
    const templates = await api.getStepOptions();
    return {
      templates,
    };
  });
  return (
    <FormControl
      margin="normal"
      required={required}
      error={Boolean(rawErrors?.length)}
    >
      <Autocomplete
        freeSolo
        options={value?.templates || []}
        value={formData || ''}
        onInputChange={(_, newInputValue) => {
          onChange(newInputValue);
        }}
        renderInput={params => (
          <TextField {...params} label="Template Name" aria-describedby="entityName" />
        )}
      />
      <FormHelperText id="entityName">
        Select from the list of available env0 templates
      </FormHelperText>
    </FormControl>
  );
};
