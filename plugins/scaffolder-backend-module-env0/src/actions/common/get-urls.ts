export const getEnv0ApiUrl = () => {
  return `https://api.env0.com`;
};

const getEnv0AppUrl = () => {
  return process.env.ENV0_APP_URL ?? 'https://app.env0.com';
};

export const getEnv0EnvironmentUrl = ({
  environmentId,
  projectId,
}: {
  environmentId: string;
  projectId: string;
}) => {
  return `${getEnv0AppUrl()}/p/${projectId}/environments/${environmentId}`;
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
