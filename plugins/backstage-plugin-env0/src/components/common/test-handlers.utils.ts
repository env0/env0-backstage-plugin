// eslint-disable-next-line @backstage/no-undeclared-imports
import { rest, RestRequest } from 'msw';

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
