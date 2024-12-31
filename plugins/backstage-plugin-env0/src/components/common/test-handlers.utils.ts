// eslint-disable-next-line @backstage/no-undeclared-imports
import { rest, RestRequest } from 'msw';
import { Env0Api } from '../../api';
import { Organization, Template } from '../../api/types';

type MockFunction = (req: RestRequest) => { status: string; data?: any };

export const baseApiUrl = '/api/proxy/env0';

export const mockRoute = (
  path: string,
  method: keyof typeof rest,
  mockFunction: MockFunction,
) => {
  return rest[method](`${baseApiUrl}/${path}`, (req, res, ctx: any) => {
    const result = mockFunction(req);

    return res(ctx.status(result?.status), ctx.body(result?.data));
  });
};

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
