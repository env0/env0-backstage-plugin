import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../api';
import useAsync from 'react-use/lib/useAsync';

export const useGetDeployments = (environmentId: string) => {
  const apiClient = useApi<Env0Api>(env0ApiRef);

  return useAsync(async () => {
    return apiClient.listDeployments(environmentId);
  }, [environmentId]);
};
