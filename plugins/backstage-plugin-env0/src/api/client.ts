import {createApiRef, ConfigApi} from '@backstage/core-plugin-api';
import {NotFoundError, NotAllowedError} from '@backstage/errors';
import {Env0Api, Env0ClientApiConfig, Env0ClientApiDependencies, Environment} from "./types";


export const env0ApiRef = createApiRef<Env0Api>({
    id: 'plugin.env0.api',
});

export class Env0Client implements Env0Api {
    static fromConfig(
        _configApi: ConfigApi,
        dependencies: Env0ClientApiDependencies,
    ) {
        const {discoveryApi, fetchApi} = dependencies;

        return new Env0Client({
            discoveryApi,
            fetchApi,
        });
    }

    constructor(private readonly config: Env0ClientApiConfig) {
    }

    // https://docs.env0.com/reference/environments-find-all
    async listEnvironments(projectId:string): Promise<Environment[]> {
        const url = `${await this.config.discoveryApi.getBaseUrl(
            'proxy',
        )}/env0/environments?projectId=${projectId}&isActive=true`;
        const project = await this.request(url, {
            method: 'GET',
        })
        return project.json();
    }

    private async request(
        url: string,
        options: RequestInit,
    ): Promise<Response> {
        const response = await this.config.fetchApi.fetch(url, options);

        if (response.status === 401) {
            throw new NotAllowedError();
        }

        if (response.status === 404) {
            throw new NotFoundError();
        }

        if (!response.ok) {
            const payload = await response.json();
            const errors = payload.errors.map((error: string) => error).join(' ');
            const message = `Request failed with ${response.status}, ${errors}`;
            throw new Error(message);
        }
        return response;
    }
}