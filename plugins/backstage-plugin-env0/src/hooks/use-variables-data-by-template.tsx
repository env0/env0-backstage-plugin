import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../api';
import { Variable } from '../api/types';
import { useAsyncRetry } from 'react-use';

const filterHiddenVariables = () => (variable: Variable) =>
  !(variable.isReadonly || variable.isOutput);

export const useVariablesDataByTemplate = (
  templateId?: string,
  projectId?: string,
) => {
  const apiClient = useApi<Env0Api>(env0ApiRef);

  return useAsyncRetry(async () => {
    if (!templateId || !projectId) {
      throw new Error('Error fetching variables please try again');
    }

    const template = await apiClient.getTemplateById(templateId);

    const variables = await apiClient.listVariables({
      projectId,
      blueprintId: templateId,
      organizationId: template.organizationId,
    });
    return variables.filter(filterHiddenVariables());
  }, [templateId]);
};
