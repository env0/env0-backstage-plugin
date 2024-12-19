import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../api';
import { useAsyncRetry } from 'react-use';

export const useVariablesDataByTemplate = (
  templateId?: string,
  projectId?: string,
  environmentId?: string
) => {
  const apiClient = useApi<Env0Api>(env0ApiRef);

  return useAsyncRetry(async () => {
    if (!templateId || !projectId) {
      throw new Error(
        `Error fetching variables, missing templateId or projectId please try again.`,
      );
    }

    const template = await apiClient.getTemplateById(templateId);

    return await apiClient.listVariables({
      environmentId,
      projectId,
      blueprintId: templateId,
      organizationId: template.organizationId,
    });

    const setIds = variables
      .filter(v => v.scope === 'SET')
      .map(v => v.scopeId!);

    const variablesSets = await apiClient.findVariableSets(setIds);
    return { variables, variablesSets };
  }, [templateId]);
};
