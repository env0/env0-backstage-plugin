import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from './App';
import jestPreview, { jestPreviewConfigure } from 'jest-preview';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { registerMswTestHooks, TestApiProvider } from '@backstage/test-utils';
import { identityApiRef, configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/core-app-api';

jestPreviewConfigure({ autoPreview: true });

const mockIdentityApi = {
  getBackstageIdentity: jest.fn().mockResolvedValue({
    identity: {
      id: 'guest-user',
      userEntityRef: 'user:default/guest',
      name: 'Guest User',
      metadata: {
        verified: true,
      },
    },
  }),
  getCredentials: jest.fn(),
  getProfile: jest.fn(),
  signOut: jest.fn(),
};

const mockConfig = new ConfigReader({
  auth: {
    providers: {
      guest: {
        enabled: true,
        legacyGuestToken: true,
      },
    },
  },
});

const apiBaseUrl = 'http://localhost:7007/api/proxy/env0';
type MockFunction = (req: any) => { status: string; data?: any };

function mockRoute(
  path: string,
  method: keyof typeof rest,
  mockFunction: MockFunction,
) {
  return rest[method](`${apiBaseUrl}/${path}`, (req, res, ctx: any) => {
    const result = mockFunction(req);

    return res(ctx.status(result?.status), ctx.body(result?.data));
  });
}

const mockedTemplates = [
  {
    id: 'template-1',
    name: 'Template 1',
    description: 'Description 1',
  },
  {
    id: 'template-2',
    name: 'Template 2',
    description: 'Description 2',
  },
];
const mockedOrgs = [
  {
    id: 'org-1',
    name: 'Organization 1',
  },
];

const mockedProjects = [
  {
    id: 'project-1',
    name: 'Project 1',
    organizationId: 'org-1',
    isArchived: false,
  },
];

describe('App', () => {
  const server = setupServer(
    mockRoute('blueprints', 'get', () => ({
      status: '200',
      data: mockedTemplates,
    })),
    mockRoute('organizations', 'get', () => ({
      status: '200',
      data: mockedOrgs,
    })),
    mockRoute('projects', 'get', () => ({
      status: '200',
      data: mockedProjects,
    })),
  );
  registerMswTestHooks(server);

  const navigateToEnv0CreatePage = async () => {
    await userEvent.click(await screen.findByText('Enter'));
    await userEvent.click(await screen.findByText('Create'));
    await userEvent.click(await screen.findByText('Choose'));
  };

  beforeAll(async () => {
    process.env = {
      NODE_ENV: 'test',
      APP_CONFIG: [
        {
          data: {
            app: { title: 'Test' },
            backend: { baseUrl: 'http://localhost:7007' },
          },
          context: 'test',
        },
      ] as any,
    };

    render(
      <TestApiProvider
        apis={[
          [identityApiRef, mockIdentityApi],
          [configApiRef, mockConfig],
        ]}
      >
        <App />
      </TestApiProvider>,
    );
    await navigateToEnv0CreatePage();
  });

  it('should render env0 create environment page', async () => {
    expect(
      await screen.findByText('Create an env0 Environment'),
    ).toBeInTheDocument();
  });

  it('should show the available templates', async () => {
    const selector = await screen.findByTestId('env0-template-selector');
    await userEvent.click(within(selector).queryByRole('combobox')!);
    await waitFor(() => {
      expect(screen.getByText('Template 1')).toBeInTheDocument();
    });
    jestPreview.debug();
  });
});
