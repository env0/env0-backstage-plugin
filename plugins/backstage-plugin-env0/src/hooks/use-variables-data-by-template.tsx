import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../api';
import useAsync from 'react-use/lib/useAsync';

export const useVariablesDataByTemplate = (
  templateId: string,
  projectId: string,
) => {
  const apiClient = useApi<Env0Api>(env0ApiRef);

  return useAsync(async () => {
    const template = await apiClient.getTemplateById(templateId);

    return apiClient.listVariables({
      projectId,
      templateId,
      organizationId: template.organizationId,
    });
  }, [templateId]);
};
