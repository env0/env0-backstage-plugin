import React from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, Template } from '../../api/types';
import { env0ApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsyncRetry';
import Autocomplete from '@mui/material/Autocomplete';
import uniqBy from 'lodash/uniqBy';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import { PopupError } from '../common/popup-error';

const Env0TemplateSelectorFieldSchema = makeFieldSchema({
  output: z => z.string(),
  uiOptions: z => z.object({}),
});

export const Env0TemplateSelectorSchema =
  Env0TemplateSelectorFieldSchema.schema;
type Env0TemplateSelectorFieldProps =
  typeof Env0TemplateSelectorFieldSchema.type;

export const Env0TemplateSelector = ({
  onChange: onTemplateIdChange,
  schema,
  rawErrors,
  required,
  formData: selectedTemplateId,
}: Env0TemplateSelectorFieldProps) => {
  const api = useApi<Env0Api>(env0ApiRef);
  const { value, loading, error } = useAsync(async () => {
    const organizations = await api.getOrganizations();
    const projects = (
      await Promise.all(
        organizations.map(organization =>
          api.getProjectsByOrganizationId(organization.id),
        ),
      )
    ).flatMap(organization => organization);
    const templates = (
      await Promise.all(
        projects.map(project => api.getTemplatesByProjectId(project.id)),
      )
    ).flatMap(template => template);

    return {
      templates: uniqBy(templates, 'id'),
    };
  });
  const templates = value?.templates || [];
  return (
    <>
      {error && (
        <PopupError
          error={error}
          message="Failed to load templates from env0. Please try again later."
        />
      )}
      <FormControl
        margin="normal"
        required={required}
        error={Boolean(rawErrors?.length)}
        data-testid="env0-template-selector"
      >
        <Autocomplete<Template>
          loading={loading}
          getOptionLabel={option => option.name}
          options={templates || []}
          value={templates.find(t => t.id === selectedTemplateId) || null}
          onChange={(_, newValue: Template | null) => {
            onTemplateIdChange(newValue?.id);
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          renderInput={params => (
            <TextField
              {...params}
              required={required}
              label={schema.title}
              aria-describedby="entityName"
            />
          )}
        />
        <FormHelperText>
          Select from the list of available env0 templates
        </FormHelperText>
      </FormControl>
    </>
  );
};
