import { Env0Api } from '../../api';
import { Organization, Template } from '../../api/types';

const mockOrganizationData: Organization[] = [
  {
    id: 'org-123',
  },
];

const mockTemplateData: Partial<Template> = {
  id: 'template-123',
  name: 'test-template',
  projectIds: ['proj-123'],
  organizationId: 'org-123',
};

export const defaultEnv0Mocks: Env0Api = {
  getEnvironmentById: jest.fn().mockResolvedValue({}),
  getOrganizations: jest.fn().mockResolvedValue(mockOrganizationData),
  getTemplateById: jest.fn().mockResolvedValue(mockTemplateData),
  redeployEnvironment: jest.fn().mockResolvedValue({}),
  listVariables: jest.fn().mockResolvedValue([]),
  findVariableSetById: jest.fn().mockResolvedValue({}),
  listDeployments: jest.fn().mockResolvedValue([]),
  getProjectById: jest.fn().mockResolvedValue({}),
  getProjectsByOrganizationId: jest.fn().mockResolvedValue([]),
  getTemplatesByProjectId: jest.fn().mockResolvedValue([]),
};
