import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { Env0Api, env0ApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';

export const useGetEnvironmentById = (environmentId: string) => {
  const apiClient = useApi<Env0Api>(env0ApiRef);

  return useAsyncRetry(async () => {
    return apiClient.getEnvironmentById(environmentId);
  }, [environmentId]);
};
