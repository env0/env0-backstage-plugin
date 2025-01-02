import { createEnv0RedeployEnvironmentAction } from './redeploy-environment';
import { apiClient } from './common/api-client';
import { getEnv0DeploymentUrl } from './common/get-urls';

jest.mock('./common/api-client', () => ({
  apiClient: {
    redeployEnvironment: jest.fn(),
    getEnvironment: jest.fn(),
  },
}));

jest.mock('./common/get-urls', () => ({
  getEnv0DeploymentUrl: jest.fn(),
}));

describe('redeploy environment action', () => {
  const mockPluginContext = {
    input: {
      id: 'env-123',
      comment: 'Test redeployment',
      variables: [
        {
          id: 'var-1',
          name: 'TEST_VAR',
          value: 'test-value',
        },
      ],
      requiresApproval: true,
      ttl: { type: 'INFINITE' },
    },
    output: jest.fn(),
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
  } as any;

  const mockRedeployResponse = {
    id: 'deploy-789',
  };

  const mockEnvironmentResponse = {
    projectId: 'project-123',
  };

  const mockDeploymentUrl =
    'https://app.env0.com/p/project-123/environments/env-123/deployments/deploy-789';

  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.redeployEnvironment as jest.Mock).mockResolvedValue(
      mockRedeployResponse,
    );
    (apiClient.getEnvironment as jest.Mock).mockResolvedValue(
      mockEnvironmentResponse,
    );
    (getEnv0DeploymentUrl as jest.Mock).mockReturnValue(mockDeploymentUrl);
  });

  it('should redeploy an environment successfully', async () => {
    const action = createEnv0RedeployEnvironmentAction();
    await action.handler(mockPluginContext);

    expect(apiClient.redeployEnvironment).toHaveBeenCalledWith(
      mockPluginContext.input.id,
      {
        deployRequest: {
          comment: mockPluginContext.input.comment,
          configurationChanges: mockPluginContext.input.variables,
          userRequiresApproval: mockPluginContext.input.requiresApproval,
          ttl: mockPluginContext.input.ttl
        },
      },
    );

    expect(apiClient.getEnvironment).toHaveBeenCalledWith(
      mockPluginContext.input.id,
    );
  });

  it('should set the deployment values in the context output', async () => {
    const action = createEnv0RedeployEnvironmentAction();
    await action.handler(mockPluginContext);

    expect(mockPluginContext.output).toHaveBeenCalledWith(
      'deploymentUrl',
      mockDeploymentUrl,
    );
    expect(mockPluginContext.output).toHaveBeenCalledWith(
      'environmentId',
      mockPluginContext.input.id,
    );
    expect(mockPluginContext.output).toHaveBeenCalledWith(
      'deploymentId',
      mockRedeployResponse.id,
    );
  });

  it('should handle redeploy API errors', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid environment ID',
        },
      },
    };
    (apiClient.redeployEnvironment as jest.Mock).mockRejectedValue(mockError);

    const action = createEnv0RedeployEnvironmentAction();

    await expect(action.handler(mockPluginContext)).rejects.toThrow(
      '{"message":"Invalid environment ID"}',
    );
  });

  it('should handle get environment API errors', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Failed to get environment',
        },
      },
    };
    (apiClient.getEnvironment as jest.Mock).mockRejectedValue(mockError);

    const action = createEnv0RedeployEnvironmentAction();

    await expect(action.handler(mockPluginContext)).rejects.toThrow(
      '{"message":"Failed to get environment"}',
    );
  });

  it('should handle optional fields correctly', async () => {
    const minimalContext = {
      ...mockPluginContext,
      input: {
        id: 'env-123',
      },
    };

    const action = createEnv0RedeployEnvironmentAction();
    await action.handler(minimalContext);

    expect(apiClient.redeployEnvironment).toHaveBeenCalledWith(
      minimalContext.input.id,
      {
        deployRequest: {
          comment: undefined,
          configurationChanges: undefined,
        },
      },
    );
  });

  it('should throw error when redeployment fails without response data', async () => {
    const mockError = new Error('Network error');
    (apiClient.redeployEnvironment as jest.Mock).mockRejectedValue(mockError);

    const action = createEnv0RedeployEnvironmentAction();

    await expect(action.handler(mockPluginContext)).rejects.toThrow(
      'Network error',
    );
  });
});
