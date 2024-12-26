import React, { useMemo } from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, Project } from '../../api/types';
import { env0ApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsyncRetry';
import Autocomplete from '@mui/material/Autocomplete';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';
import { PopupError } from '../common/popup-error';

const Env0ProjectSelectorFieldSchema = makeFieldSchema({
  output: z => z.string(),
  uiOptions: z =>
    z.object({
      env0TemplateId: z.string().optional(),
    }),
});

export const Env0ProjectSelectorSchema = Env0ProjectSelectorFieldSchema.schema;
type Env0ProjectSelectorFieldProps =
  typeof Env0ProjectSelectorFieldSchema.TProps;

const useGetProjectsByTemplateId = (templateId?: string) => {
  const api = useApi<Env0Api>(env0ApiRef);
  const {
    value: projectValue,
    loading: loadingProjects,
    error: errorProjects,
  } = useAsync(async () => {
    const organizations = await api.getOrganizations();
    const projects = (
      await Promise.all(
        organizations.map(organization =>
          api.getProjectsByOrganizationId(organization.id),
        ),
      )
    ).flatMap(project => project);
    return { projects };
  });

  const {
    value: templateValue,
    loading: loadingTemplate,
    error: errorTemplate,
  } = useAsync(async () => {
    if (templateId) {
      const template = await api.getTemplateById(templateId);
      return { template };
    }
    return { template: undefined };
  }, [templateId]);

  const projects = useMemo(() => {
    if (templateValue?.template) {
      const projectIds = templateValue?.template.projectIds;
      return (
        projectValue?.projects.filter(project =>
          projectIds?.includes(project.id),
        ) || []
      );
    }
    return projectValue?.projects || [];
  }, [templateValue, projectValue]);
  const error = errorProjects || errorTemplate;
  return {
    error,
    loading: loadingProjects || loadingTemplate,
    projects,
  };
};

export const Env0ProjectSelector = ({
  onChange: onProjectIdChange,
  schema,
  rawErrors,
  required,
  formContext,
  formData: selectedProjectId,
  uiSchema,
}: Env0ProjectSelectorFieldProps) => {
  const formTemplateId: string | undefined =
    formContext?.formData?.env0_template_id;
  const rawUiSchemaTemplateId = uiSchema?.['ui:options']?.['env0TemplateId'];
  const selectedTemplateId = formTemplateId || rawUiSchemaTemplateId;
  const { projects, error, loading } =
    useGetProjectsByTemplateId(selectedTemplateId);

  return (
    <>
      {error && (
        <PopupError
          error={error}
          message="Failed to load templates or projects from env0. Please try again later."
        />
      )}
      <FormControl
        margin="normal"
        required={required}
        error={Boolean(rawErrors?.length)}
      >
        <Autocomplete<Project>
          loading={loading}
          disabled={!formTemplateId}
          getOptionLabel={option => option.name}
          options={projects}
          value={projects.find(p => p.id === selectedProjectId) || null}
          onChange={(_, newValue: Project | null) => {
            onProjectIdChange(newValue?.id);
          }}
          renderOption={(props, option) => (
              <li {...props} key={option.id}>{option.name}</li>
          )}
          renderInput={params => (
            <TextField
              {...params}
              required={required}
              label={schema.title}
              aria-describedby="projectName"
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
