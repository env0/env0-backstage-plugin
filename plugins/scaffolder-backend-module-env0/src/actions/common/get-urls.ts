export const getEnv0EnvironmentUrl = ({
  environmentId,
  projectId,
}: {
  environmentId: string;
  projectId: string;
}) => {
  return `https://app.env0.com/p/${projectId}/environments/${environmentId}`;
};

export const getEnv0DeploymentUrl = ({
  environmentId,
  deploymentId,
  projectId,
}: {
  environmentId: string;
  deploymentId: string;
  projectId: string;
}) => {
  return `${getEnv0EnvironmentUrl({
    environmentId,
    projectId,
  })}/deployments/${deploymentId}`;
};
