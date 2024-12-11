import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { apiClient } from './common/api-client';
import { commentSchema, variablesSchema } from './common/schema';

export type RedeployEnvironmentArgs = z.infer<typeof schema>;

const schema = z.object({
  id: z.string({ description: 'The ID of the environment to redeploy' }),
  comment: commentSchema.optional(),
  variables: variablesSchema.optional(),
});

export function createEnv0RedeployEnvironmentAction() {
  return createTemplateAction<RedeployEnvironmentArgs>({
    id: 'env0:environment:redeploy',
    description: 'Redeploys an existing env0 environment',
    schema: {
      input: schema,
    },
    async handler(ctx) {
      ctx.logger.info(`Redeploying env0 environment`);

      const { id } = await apiClient.redeployEnvironment(ctx.input.id, {
        deployRequest: {
          comment: ctx.input.comment,
          configurationChanges: ctx.input.variables,
        },
      });

      ctx.logger.info(`env0 environment re-deploy initiated successfully`);
      ctx.output('environmentId', ctx.input.id);
      ctx.output('deploymentId', id);
    },
  });
}
