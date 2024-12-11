export const getEnv0ApiUrl = () => {
  return `https://${process.env.ENV0_API_ENDPOINT ?? 'api.env0.com'}`;
};

const getEnv0AppUrl = () => {
  return process.env.ENV0_APP_URL ?? 'https://app.env0.com';
};

export const getEnv0EnvironmentLink = ({
  environmentId,
  projectId,
}: {
  environmentId: string;
  projectId: string;
}) => {
  return `${getEnv0AppUrl()}/p/${projectId}/environments/${environmentId}`;
};

export const getEnv0DeploymentLink = ({
  environmentId,
  deploymentId,
  projectId,
}: {
  environmentId: string;
  deploymentId: string;
  projectId: string;
}) => {
  return `${getEnv0EnvironmentLink({
    environmentId,
    projectId,
  })}/deployments/${deploymentId}`;
};
