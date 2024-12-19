export type Resource = {
  provider: string;
  type: string;
  name: string;
  moduleName: string;
};

export type User = {
  email: string;
  user_id: string;
  name: string;
  given_name: string;
  family_name: string;
};

export type GitProviders =
  | 'Other'
  | 'GitHub'
  | 'GitLab'
  | 'AzureDevOps'
  | 'HelmRepository'
  | 'BitBucket'
  | 'BitBucketServer'
  | 'GitLabEnterprise'
  | 'GitHubEnterprise';

export type TemplateType =
  | 'opentofu'
  | 'terraform'
  | 'terragrunt'
  | 'pulumi'
  | 'k8s'
  | 'cloudformation'
  | 'helm'
  | 'ansible'
  | 'workflow'
  | 'module'
  | 'approval-policy'
  | 'custom-flow'
  | 'environment-discovery';
export type Template = {
  name: string;
  id: string;
  repository: string;
  githubInstallationId?: number;
  isGitLab?: boolean;
  isAzureDevOps?: boolean;
  isHelmRepository?: boolean;
  bitbucketClientKey?: boolean;
  isBitbucketServer?: boolean;
  isGitLabEnterprise?: boolean;
  isGitHubEnterprise?: boolean;
  type: TemplateType;
  projectIds: string[];
  organizationId: string;
};

export type EnvironmentStatus =
  | 'CREATED'
  | 'INACTIVE'
  | 'ACTIVE'
  | 'FAILED'
  | 'TIMEOUT'
  | 'WAITING_FOR_USER'
  | 'DEPLOY_IN_PROGRESS'
  | 'DESTROY_IN_PROGRESS'
  | 'PR_PLAN_IN_PROGRESS'
  | 'REMOTE_PLAN_IN_PROGRESS'
  | 'DRIFT_DETECTION_IN_PROGRESS'
  | 'TASK_IN_PROGRESS'
  | 'ABORTING'
  | 'ABORTED'
  | 'NEVER_DEPLOYED'
  | 'DRIFTED';

export type EnvironmentDriftStatus =
  | 'ERROR'
  | 'DRIFTED'
  | 'OK'
  | 'NEVER_RUN'
  | 'DISABLED';

export type Environment = {
  name: string;
  status: EnvironmentStatus;
  driftStatus: EnvironmentDriftStatus;
  latestDeploymentLog: Deployment;
  workspaceName: string;
  resources?: Resource[];
  user: User;
  organizationId: string;
  projectId: string;
};

type DeploymentType =
  | 'deploy'
  | 'destroy'
  | 'prPlan'
  | 'driftDetection'
  | 'task'
  | 'remotePlan';

export type DeploymentStatus =
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'TIMEOUT'
  | 'FAILURE'
  | 'SUCCESS'
  | 'CANCELLED'
  | 'INTERNAL_FAILURE'
  | 'ABORTING'
  | 'ABORTED'
  | 'QUEUED'
  | 'SKIPPED'
  | 'NEVER_DEPLOYED';

export interface Deployment {
  id: string;
  type: DeploymentType;
  error?: Error;
  status: DeploymentStatus;
  planSummary: { added: number; changed: number; destroyed: number };
  resourceCount: number;
  startedAt: Date;
  finishedAt: Date;
  blueprintRevision: string;
  blueprintRepository: string;
  blueprintId: string;
}

type PartialJSONSchema7 = {
  type?: 'string';
  enum?: string[];
  format?: 'HCL' | 'JSON' | 'ENVIRONMENT_OUTPUT';
};

type ConfigurationScope =
  | 'SET'
  | 'GLOBAL'
  | 'BLUEPRINT'
  | 'PROJECT'
  | 'WORKFLOW'
  | 'ENVIRONMENT'
  | 'DEPLOYMENT';

type VariableFields = {
  id: string;
  name: string;
  value?: string;
  isSensitive?: boolean;
  isReadonly?: boolean;
  isRequired?: boolean;
  isOutput?: boolean;
  regex?: string;
  schema?: PartialJSONSchema7;
  description?: string;

  // For grouping
  scopeId?: string;
  scope: ConfigurationScope;
};

export type Variable = VariableFields & {
  overwrites?: VariableFields;
  // Not part of the API response
  originalVariableScope?: ConfigurationScope;
};

export type VariableSet = {
  id?: string;
  name: string;
  description?: string;
};

export type Organization = {
  id: string;
};

export type Project = {
  id: string;
  organizationId: string;
  name: string;
};

export type ListVariablesParams = {
  environmentId?: string;
  projectId: string;
  blueprintId: string;
  organizationId: string;
};

export type Env0Api = {
  listDeployments(environmentId: string): Promise<Deployment[]>;
  listVariables({
    environmentId,
    projectId,
    blueprintId,
    organizationId,
  }: ListVariablesParams): Promise<Variable[]>;
  findVariableSets(setIds: string[]): Promise<VariableSet[]>;
  getEnvironmentById(environmentId: string): Promise<Environment>;
  getTemplatesByProjectId(projectId): Promise<Template[]>;
  getTemplateById(templateId: string): Promise<Template>;
  getOrganizations(): Promise<Organization[]>;
  getProjectsByOrganizationId(organizationId: string): Promise<Project[]>;
  getProjectById(projectId: string): Promise<Project>;
  redeployEnvironment(environmentId: string): Promise<Deployment>;
};

export type DeploymentStepStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'FAIL'
  | 'SUCCESS'
  | 'CANCELLED'
  | 'TIMEOUT'
  | 'SKIPPED'
  | 'WARNING';
