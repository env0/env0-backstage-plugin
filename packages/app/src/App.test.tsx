import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from './App';
import jestPreview, { jestPreviewConfigure } from 'jest-preview';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

jestPreviewConfigure({ autoPreview: true });

const apiBaseUrl = 'http://localhost:7007/api/env0';
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

describe('App', () => {
  const navigateToEnv0CreatePage = async () => {
    render(<App />);
    await userEvent.click(await screen.findByText('Enter'));
    await userEvent.click(await screen.findByText('Create'));
    await userEvent.click(await screen.findByText('Choose'));
  };

  beforeAll(async () => {
    const server = setupServer();
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

    server.use(
      mockRoute('templates', 'get', () => ({
        status: '200',
        data: mockedTemplates,
      })),
    );
    await navigateToEnv0CreatePage();
  });

  it('should render env0 create environment page', async () => {
    expect(
      await screen.findByText('Create an env0 Environment'),
    ).toBeInTheDocument();
  });

  it('should show the available templates', async () => {
    expect(
      waitFor(() => screen.getByText('Template 1234')),
    ).toBeInTheDocument();
    jestPreview.debug();
  });
});
