import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../api';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';

export const useGetDeployments = (environmentId: string) => {
  const apiClient = useApi<Env0Api>(env0ApiRef);

  return useAsyncRetry(async () => {
    return apiClient.listDeployments(environmentId);
  }, [environmentId]);
};
