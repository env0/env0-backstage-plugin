import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { apiClient } from './common/api-client';
import { commentSchema, variablesSchema } from './common/schema';
import { getEnv0DeploymentLink } from './common/get-urls';

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
      const environmentId = ctx.input.id;

      const { id: deploymentId } = await apiClient.redeployEnvironment(
        environmentId,
        {
          deployRequest: {
            comment: ctx.input.comment,
            configurationChanges: ctx.input.variables,
          },
        },
      );

      const { projectId } = await apiClient.getEnvironment(environmentId);

      ctx.logger.info(`env0 environment re-deploy initiated successfully`);

      ctx.output('environmentId', environmentId);
      ctx.output('deploymentId', deploymentId);
      ctx.output(
        'deploymentLink',
        getEnv0DeploymentLink({
          environmentId,
          deploymentId,
          projectId,
        }),
      );
    },
  });
}
