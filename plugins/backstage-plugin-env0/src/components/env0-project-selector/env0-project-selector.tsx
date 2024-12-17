import React, { useMemo, useState } from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, Project } from '../../api/types';
import { env0ApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsyncRetry';
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@mui/material/IconButton';
import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

const Env0ProjectSelectorFieldSchema = makeFieldSchema({
  output: z => z.string(),
  uiOptions: z => z.object({
    env0TemplateId: z.string().optional()
  }),
});

export const Env0ProjectSelectorSchema = Env0ProjectSelectorFieldSchema.schema;
type Env0ProjectSelectorFieldProps = typeof Env0ProjectSelectorFieldSchema.type;

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
  const annotationTemplateId: string | undefined =
    typeof rawUiSchemaTemplateId === 'string'
      ? rawUiSchemaTemplateId
      : undefined;

  const selectedTemplateId = formTemplateId || annotationTemplateId;

  const api = useApi<Env0Api>(env0ApiRef);
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(true);
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
    ).flatMap(organization => organization);
    return { projects };
  });

  const {
    value: templateValue,
    loading: loadingTemplate,
    error: errorTemplate,
  } = useAsync(async () => {
    if (selectedTemplateId) {
      const template = await api.getTemplateById(selectedTemplateId);
      return { template };
    }
    return { template: undefined };
  }, [selectedTemplateId]);

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

  const snackbar = (
    <>
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
          {(errorProjects || errorTemplate)?.message}
        </Alert>
      </Snackbar>
    </>
  );

  return (
    <>
      {(errorProjects || errorTemplate) && snackbar}
      <FormControl
        margin="normal"
        required={required}
        error={Boolean(rawErrors?.length)}
      >
        <Autocomplete<Project>
          loading={loadingProjects || loadingTemplate}
          getOptionLabel={option => option.name}
          options={projects || []}
          value={projects.find(p => p.id === selectedProjectId) || null}
          onChange={(_, newValue: Project | null) => {
            onProjectIdChange(newValue?.id);
          }}
          renderInput={params => (
            <TextField
              {...params}
              label={required ? `${schema.title}*` : schema.title}
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
