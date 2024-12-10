import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CreateEnvironmentArgs } from '../create-environment';
import type { RedeployEnvironmentArgs } from '../redeploy-environment';

const DEFAULT_TIMEOUT = 10_000; // 10 seconds

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'backstage-scaffolder-module-env0',
        Authorization: `Basic ${process.env.ENV0_ACCESS_TOKEN}`,
      },
    });
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

  private async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  public async createEnvironment(
    data: CreateEnvironmentArgs,
  ): Promise<{ id: string }> {
    return this.post('/environments', data);
  }

  public async deployEnvironment(
    id: string,
    data: Omit<RedeployEnvironmentArgs, 'id'>,
  ): Promise<{ id: string }> {
    return this.put(`/environments/${id}`, data);
  }
}

export const apiClient = new ApiClient({
  baseURL: 'https://api.env0.com',
  timeout: DEFAULT_TIMEOUT,
});
