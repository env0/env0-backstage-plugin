import { useQuery } from '@tanstack/react-query';
import { useApi } from '@backstage/core-plugin-api';
import { Env0Api, env0ApiRef } from '../api';

export const useGetDeployments = (environmentId: string) => {
  const apiClient = useApi<Env0Api>(env0ApiRef);

  return useQuery({
    queryKey: ['deployments', environmentId],
    queryFn: () => apiClient.listDeployments(environmentId),
  });
};
