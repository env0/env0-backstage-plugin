import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { apiClient } from './common/api-client';
import { commentSchema, variablesSchema } from './common/schema';

export type CreateEnvironmentArgs = z.infer<typeof schema>;

const schema = z.object({
  name: z.string({ description: 'The name of the environment' }),
  comment: commentSchema.optional(),
  templateId: z.string({
    description: 'The ID of the template to be deployed',
  }),
  projectId: z.string({
    description: 'The ID of the project to place the new environment on',
  }),
  variables: variablesSchema.optional(),
});

export function createEnv0CreateEnvironmentAction() {
  return createTemplateAction<CreateEnvironmentArgs>({
    id: 'env0:environment:create',
    description: 'Creates a new env0 environment',
    schema: {
      input: schema,
    },
    async handler(ctx) {
      ctx.logger.info(`Creating env0 environment`);

      const { id } = await apiClient.createEnvironment({
        name: ctx.input.name,
        projectId: ctx.input.projectId,
        deployRequest: {
          comment: ctx.input.comment,
          blueprintId: ctx.input.templateId,
          configurationChanges: ctx.input.variables,
        },
      });

      ctx.logger.info(`env0 environment creation initiated successfully`);
      ctx.output('environmentId', id);
    },
  });
}
