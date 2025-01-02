import { createEnv0CreateEnvironmentAction } from './create-environment';
import { apiClient } from './common/api-client';
import { getEnv0EnvironmentUrl } from './common/get-urls';

jest.mock('./common/api-client', () => ({
  apiClient: {
    createEnvironment: jest.fn(),
  },
}));

jest.mock('./common/get-urls', () => ({
  getEnv0EnvironmentUrl: jest.fn(),
}));

describe('create environment action', () => {
  const mockPluginContext = {
    input: {
      name: 'test-environment',
      projectId: 'project-123',
      templateId: 'template-456',
      comment: 'Test deployment',
      variables: [
        {
          id: 'var-1',
          name: 'TEST_VAR',
          value: 'test-value',
        },
      ],
      requiresApproval: false,
      continuousDeployment: true,
      pullRequestPlanDeployments: false,
      ttl: { type: 'HOURS', value: '6' },
    },
    output: jest.fn(),
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
  } as any;

  const mockEnvironmentResponse = {
    id: 'env-789',
    organizationId: 'org-123',
  };

  const mockEnvironmentUrl =
    'https://app.env0.com/p/project-123/environments/env-789';

  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.createEnvironment as jest.Mock).mockResolvedValue(
      mockEnvironmentResponse,
    );
    (getEnv0EnvironmentUrl as jest.Mock).mockReturnValue(mockEnvironmentUrl);
  });

  it('should create an environment successfully', async () => {
    const action = createEnv0CreateEnvironmentAction();
    await action.handler(mockPluginContext);

    expect(apiClient.createEnvironment).toHaveBeenCalledWith({
      name: mockPluginContext.input.name,
      projectId: mockPluginContext.input.projectId,
      configurationChanges: mockPluginContext.input.variables,
      continuousDeployment: mockPluginContext.input.continuousDeployment,
      requiresApproval: mockPluginContext.input.requiresApproval,
      pullRequestPlanDeployments:
        mockPluginContext.input.pullRequestPlanDeployments,
      ttl: mockPluginContext.input.ttl,
      deployRequest: {
        comment: mockPluginContext.input.comment,
        blueprintId: mockPluginContext.input.templateId,
      },
    });
  });

  it('should add the environment values into the context output', async () => {
    const action = createEnv0CreateEnvironmentAction();
    await action.handler(mockPluginContext);

    expect(mockPluginContext.output).toHaveBeenCalledWith(
      'environmentUrl',
      mockEnvironmentUrl,
    );
    expect(mockPluginContext.output).toHaveBeenCalledWith(
      'environmentId',
      mockEnvironmentResponse.id,
    );
    expect(mockPluginContext.output).toHaveBeenCalledWith(
      'organizationId',
      mockEnvironmentResponse.organizationId,
    );
  });

  it('should handle API errors', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid project ID',
        },
      },
    };
    (apiClient.createEnvironment as jest.Mock).mockRejectedValue(mockError);

    const action = createEnv0CreateEnvironmentAction();

    await expect(action.handler(mockPluginContext)).rejects.toThrow(
      '{"message":"Invalid project ID"}',
    );
  });

  it('should handle optional fields correctly', async () => {
    const minimalContext = {
      ...mockPluginContext,
      input: {
        name: 'test-environment',
        projectId: 'project-123',
        templateId: 'template-456',
      },
    };

    const action = createEnv0CreateEnvironmentAction();
    await action.handler(minimalContext);

    expect(apiClient.createEnvironment).toHaveBeenCalledWith({
      name: minimalContext.input.name,
      projectId: minimalContext.input.projectId,
      configurationChanges: undefined,
      deployRequest: {
        comment: undefined,
        blueprintId: minimalContext.input.templateId,
      },
    });
  });

  it('should throw error when environment creation fails without response data', async () => {
    const mockError = new Error('Network error');
    (apiClient.createEnvironment as jest.Mock).mockRejectedValue(mockError);

    const action = createEnv0CreateEnvironmentAction();

    await expect(action.handler(mockPluginContext)).rejects.toThrow(
      'Network error',
    );
  });
});
