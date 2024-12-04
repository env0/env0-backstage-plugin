import {DiscoveryApi, FetchApi} from "@backstage/core-plugin-api";

export type Env0ClientApiDependencies = {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
};

export type Env0ClientApiConfig = Env0ClientApiDependencies & {};

export interface Environment {
    name: string;
    organizationId: string;
    projectId: string;
    userId: string;
    workspaceName: string;
}

export type Env0Api = {
    getEnvironmentByID(environmentId: string): Promise<Environment>;
}
