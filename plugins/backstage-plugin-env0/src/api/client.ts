import { createApiRef, ConfigApi } from '@backstage/core-plugin-api';
import {
  NotFoundError,
  NotAllowedError,
  ServiceUnavailableError,
} from '@backstage/errors';
import { Deployment, Template, Environment } from './types';

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export type Env0ClientApiDependencies = {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
};

export type Env0ClientApiConfig = Env0ClientApiDependencies & {};

export type Env0Api = {
  getEnvironmentByID(environmentId: string): Promise<Environment>;
  listDeployments(environmentId: string): Promise<Deployment[]>;
  getTemplateById(templateId: string): Promise<Template>;
};

export const env0ApiRef = createApiRef<Env0Api>({
  id: 'plugin.env0.api',
});

export class Env0Client implements Env0Api {
  static fromConfig(
    _configApi: ConfigApi,
    dependencies: Env0ClientApiDependencies,
  ) {
    const { discoveryApi, fetchApi } = dependencies;

    return new Env0Client({
      discoveryApi,
      fetchApi,
    });
  }

  constructor(private readonly config: Env0ClientApiConfig) {}

  // https://docs.env0.com/reference/environments-find-by-id
  async getEnvironmentByID(environmentId: string): Promise<Environment> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/env0/environments/${environmentId}`;
    const environment = await this.request(url, {
      method: 'GET',
    });
    return environment.json();
  }

  // https://docs.env0.com/reference/templates-get-blueprint-by-id
  async getTemplateById(templateId: string): Promise<Template> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/env0/blueprints/${templateId}`;
    const template = await this.request(url, {
      method: 'GET',
    });
    return template.json();
  }
  // https://docs.env0.com/reference/deployments-find-all
  async listDeployments(environmentId: string): Promise<Deployment[]> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/env0/environments/${environmentId}/deployments`;
    const deployments = await this.request(url, {
      method: 'GET',
    });
    return deployments.json();
  }

  private async request(url: string, options: RequestInit): Promise<Response> {
    const response = await this.config.fetchApi.fetch(url, options);

    if (response.status === 401) {
      throw new NotAllowedError(await response.text());
    } else if (response.status === 404) {
      throw new NotFoundError(await response.text());
    } else if (response.status === 504) {
      throw new ServiceUnavailableError(await response.text());
    }

    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }
}
