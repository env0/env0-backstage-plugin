import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { apiClient } from './common/api-client';
import { variablesSchema } from './common/schema';

type Args = z.infer<typeof schema>;

const schema = z.object({
  name: z.string({ description: 'The name of the environment' }),
  templateId: z.string({
    description: 'The ID of the template to be deployed',
  }),
  projectId: z.string({
    description: 'The ID of the project to place the new environment on',
  }),
  variables: variablesSchema.optional(),
});

export function createEnv0EnvironmentAction() {
  return createTemplateAction<Args>({
    id: 'env0:environment:create',
    description: 'Creates a new env0 environment',
    schema: {
      input: schema,
    },
    async handler(ctx) {
      ctx.logger.info(`Creating env0 environment`);

      await apiClient.createEnvironment({
        name: ctx.input.name,
        projectId: ctx.input.projectId,
        templateId: ctx.input.templateId,
        variables: ctx.input.variables,
      });

      ctx.logger.info(`env0 environment created successfully`);
    },
  });
}
