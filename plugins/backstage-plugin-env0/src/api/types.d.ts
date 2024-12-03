import {DiscoveryApi, FetchApi} from "@backstage/core-plugin-api";

export type Env0ClientApiDependencies = {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
};

export type Env0ClientApiConfig = Env0ClientApiDependencies & {};

export type Resource = {
    provider: string;
    type: string;
    name: string;
    moduleName: string;
}

export type User = {
    email: string;
    user_id: string;
    name: string;
    given_name: string;
    family_name: string;
}

export type DeploymentLog = {
    id: string;
    blueprintRevision: string;
    blueprintRepository: string

}

export type Environment = {
    name: string;
    status: 'CREATED' | 'INACTIVE' | 'ACTIVE' | 'FAILED' | 'TIMEOUT' | 'WAITING_FOR_USER' | 'DEPLOY_IN_PROGRESS' | 'DESTROY_IN_PROGRESS' | 'PR_PLAN_IN_PROGRESS' | 'REMOTE_PLAN_IN_PROGRESS' | 'DRIFT_DETECTION_IN_PROGRESS' | 'TASK_IN_PROGRESS' | 'ABORTING' | 'ABORTED' | 'NEVER_DEPLOYED' | 'DRIFTED';
    driftStatus: 'ERROR' | 'DRIFTED' | 'OK' | 'NEVER_RUN' | 'DISABLED';
    latestDeploymentLog: DeploymentLog;
    workspaceName: string;
    resources?: Resource[];
    user: User;
}

export type Env0Api = {
    getEnvironmentByID(environmentId: string): Promise<Environment>;
}
