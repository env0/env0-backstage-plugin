import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 5000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'backstage-plugin-env0',
        ...config.headers,
      },
    });
  }

  public static getInstance(config: ApiClientConfig): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(config);
    }
    return ApiClient.instance;
  }

  // private async get<T = any>(
  //   url: string,
  //   config?: AxiosRequestConfig,
  // ): Promise<T> {
  //   const response: AxiosResponse<T> = await this.client.get(url, config);
  //   return response.data;
  // }

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

  // private async put<T = any, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig,
  // ): Promise<T> {
  //   const response: AxiosResponse<T> = await this.client.put(url, data, config);
  //   return response.data;
  // }

  // private async delete<T = any>(
  //   url: string,
  //   config?: AxiosRequestConfig,
  // ): Promise<T> {
  //   const response: AxiosResponse<T> = await this.client.delete(url, config);
  //   return response.data;
  // }

  public async createEnvironment(name: string): Promise<any> {
    const data = { name };
    return this.post('/environments', data);
  }
}

export const apiClient = ApiClient.getInstance({
  baseURL: 'https://api.env0.com',
});
