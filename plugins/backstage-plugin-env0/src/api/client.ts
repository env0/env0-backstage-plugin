import { createApiRef, ConfigApi } from '@backstage/core-plugin-api';
import {
  NotFoundError,
  NotAllowedError,
  ServiceUnavailableError,
} from '@backstage/errors';
import {
  Deployment,
  Template,
  Environment,
  Env0Api,
  Project,
  Organization,
  Variable,
  ListVariablesParams,
  VariableSet,
} from './types';

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { isNil, omitBy } from 'lodash';

export type Env0ClientApiDependencies = {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
};

export type Env0ClientApiConfig = Env0ClientApiDependencies & {};

export const env0ApiRef = createApiRef<Env0Api>({
  id: 'plugin.env0.api',
});

let proxy: string | undefined = undefined;

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

  async getBaseUrl(): Promise<string> {
    if (proxy) {
      return proxy;
    }
    proxy = await this.config.discoveryApi.getBaseUrl('proxy');
    return proxy;
  }

  // https://docs.env0.com/reference/configuration-find-variables-by-scope
  async listVariables({
    environmentId,
    projectId,
    blueprintId,
    organizationId,
  }: ListVariablesParams): Promise<Variable[]> {
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/env0/configuration`;
    const nonNullVariableScopeParams = omitBy(
      { environmentId, projectId, blueprintId, organizationId },
      isNil,
    ) as Record<string, string>;
    const variables = await this.request(
      url,
      {
        method: 'GET',
      },
      nonNullVariableScopeParams,
    );
    return variables.json();
  }

  // https://docs.env0.com/reference/configuration-find-configuration-set-by-id
  private async findVariableSetById(setId: string): Promise<VariableSet> {
    const url = `${await this.getBaseUrl()}/env0/configuration-sets/${setId}`;
    const variableSet = await this.request(url, {
      method: 'GET',
    });
    return variableSet.json();
  }

  async findVariableSets(setIds: string[]): Promise<VariableSet[]> {
    const variableSets = await Promise.all(
      setIds.map(setId => this.findVariableSetById(setId)),
    );
    return variableSets;
  }

  // https://docs.env0.com/reference/environments-find-by-id
  async getEnvironmentById(environmentId: string): Promise<Environment> {
    const url = `${await this.getBaseUrl()}/env0/environments/${environmentId}`;
    const environment = await this.request(url, {
      method: 'GET',
    });
    return environment.json();
  }

  // https://docs.env0.com/reference/templates-get-blueprint-by-id
  async getTemplateById(templateId: string): Promise<Template> {
    const url = `${await this.getBaseUrl()}/env0/blueprints/${templateId}`;
    const template = await this.request(url, {
      method: 'GET',
    });
    return template.json();
  }

  // https://docs.env0.com/reference/deployments-find-all
  async listDeployments(
    environmentId: string,
    paging = { limit: '50', offset: '0' },
  ): Promise<Deployment[]> {
    const url = `${await this.getBaseUrl()}/env0/environments/${environmentId}/deployments`;
    const deployments = await this.request(
      url,
      {
        method: 'GET',
      },
      paging,
    );
    return deployments.json();
  }

  // https://docs.env0.com/reference/templates-find-all
  async getTemplatesByProjectId(projectId: string): Promise<Template[]> {
    const url = `${await this.getBaseUrl()}/env0/blueprints?projectId=${projectId}`;
    const template = await this.request(url, {
      method: 'GET',
    });
    return template.json();
  }

  // https://docs.env0.com/reference/organization-find-organizations
  async getOrganizations(): Promise<Organization[]> {
    const url = `${await this.getBaseUrl()}/env0/organizations`;
    const organizations = await this.request(url, {
      method: 'GET',
    });
    return organizations.json();
  }

  // https://docs.env0.com/reference/projects-find-by-organization-id
  async getProjectsByOrganizationId(
    organizationId: string,
  ): Promise<Project[]> {
    const url = `${await this.getBaseUrl()}/env0/projects?organizationId=${organizationId}`;

    const projects = await this.request(url, {
      method: 'GET',
    });
    return projects.json();
  }

  // https://docs.env0.com/reference/environments-deploy
  async redeployEnvironment(environmentId: string): Promise<Deployment> {
    const url = `${await this.getBaseUrl()}/env0/environments/${environmentId}/deployments`;
    const deployment = await this.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deploymentType: 'deploy',
        triggerName: 'user',
      }),
    });
    return deployment.json();
  }

  // https://docs.env0.com/reference/projects-find-by-id
  async getProjectById(projectId: string): Promise<Project> {
    const url = `${await this.getBaseUrl()}/env0/projects/${projectId}`;

    const project = await this.request(url, {
      method: 'GET',
    });
    return project.json();
  }

  private getUrlWithParams(
    url: string,
    queryParams?: Record<string, string>,
  ): string {
    if (!queryParams) {
      return url;
    }
    return `${url}?${new URLSearchParams(queryParams).toString()}`;
  }

  private async request(
    url: string,
    options: RequestInit,
    queryParams?: Record<string, string>,
  ): Promise<Response> {
    const response = await this.config.fetchApi.fetch(
      this.getUrlWithParams(url, queryParams),
      options,
    );

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
