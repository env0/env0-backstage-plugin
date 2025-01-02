import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { apiClient } from './common/api-client';
import {commentSchema, requiresApprovalSchema, variablesSchema} from './common/schema';
import { getEnv0DeploymentUrl } from './common/get-urls';
import { extractApiError } from './common/extract-api-error';

export type RedeployEnvironmentArgs = z.infer<typeof schema>;

const schema = z.object({
  id: z.string({ description: 'The ID of the environment to redeploy' }),
  comment: commentSchema.optional(),
  variables: variablesSchema.optional(),
  requiresApproval: requiresApprovalSchema.optional()
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
      let deploymentId;
      let projectId;

      try {
        const redeployResponse = await apiClient.redeployEnvironment(
          environmentId,
          {
            deployRequest: {
              comment: ctx.input.comment,
              configurationChanges: ctx.input.variables,
              userRequiresApproval: ctx.input.requiresApproval
            },
          },
        );

        deploymentId = redeployResponse.id;
        ctx.logger.info(`env0 environment re-deploy initiated successfully`);
      } catch (error: any) {
        ctx.logger.error(`Failed to re-deploy env0 environment`);
        throw extractApiError(error);
      }

      try {
        const getEnvResponse = await apiClient.getEnvironment(environmentId);
        projectId = getEnvResponse.projectId;
      } catch (error: any) {
        ctx.logger.error(`Failed to get env0 project ID`);
        throw extractApiError(error);
      }

      const url = getEnv0DeploymentUrl({
        environmentId,
        deploymentId,
        projectId,
      });

      ctx.logger.info(`Follow the re-deploy progress at ${url}`);
      ctx.output('deploymentUrl', url);

      ctx.output('environmentId', environmentId);
      ctx.output('deploymentId', deploymentId);
    },
  });
}
