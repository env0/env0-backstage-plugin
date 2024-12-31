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
  const mockContext = {
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
    await action.handler(mockContext);

    expect(apiClient.createEnvironment).toHaveBeenCalledWith({
      name: mockContext.input.name,
      projectId: mockContext.input.projectId,
      configurationChanges: mockContext.input.variables,
      deployRequest: {
        comment: mockContext.input.comment,
        blueprintId: mockContext.input.templateId,
      },
    });
  });

  it('should the environment values into the context output', async () => {
    const action = createEnv0CreateEnvironmentAction();
    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'environmentUrl',
      mockEnvironmentUrl,
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'environmentId',
      mockEnvironmentResponse.id,
    );
    expect(mockContext.output).toHaveBeenCalledWith(
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

    await expect(action.handler(mockContext)).rejects.toThrow(
      '{"message":"Invalid project ID"}',
    );
  });

  it('should handle optional fields correctly', async () => {
    const minimalContext = {
      ...mockContext,
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

    await expect(action.handler(mockContext)).rejects.toThrow('Network error');
  });
});
