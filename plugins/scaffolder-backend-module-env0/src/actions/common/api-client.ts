import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Env0Api } from './api-client.d';
import { getEnv0ApiUrl } from './get-urls';

export interface ApiClientConfig {
  baseURL: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'backstage-scaffolder-module-env0',
        Authorization: `Basic ${process.env.ENV0_ACCESS_TOKEN}`,
      },
    });
  }

  private async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  private async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  public async getEnvironment(id: string) {
    return this.get<Env0Api.GetEnvironment.Response>(`/environments/${id}`);
  }

  public async createEnvironment(
    data: Env0Api.CreateEnvironment.Request,
  ): Promise<Env0Api.CreateEnvironment.Response> {
    return this.post('/environments', data);
  }

  public async redeployEnvironment(
    id: string,
    data: Omit<Env0Api.RedeployEnvironment.Request, 'id'>,
  ): Promise<Env0Api.RedeployEnvironment.Response> {
    return this.post(`/environments/${id}/deployments`, data);
  }
}

export const apiClient = new ApiClient({
  baseURL: getEnv0ApiUrl(),
});
