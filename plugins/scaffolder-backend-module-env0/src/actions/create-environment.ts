import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
import { apiClient } from './common/api-client';
import {
  commentSchema,
  continuousDeploymentSchema,
  pullRequestPlanDeploymentsSchema,
  requiresApprovalSchema, ttlSchema,
  variablesSchema,
} from './common/schema';
import { getEnv0EnvironmentUrl } from './common/get-urls';
import { extractApiError } from './common/extract-api-error';

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
  requiresApproval: requiresApprovalSchema.optional(),
  continuousDeployment: continuousDeploymentSchema.optional(),
  pullRequestPlanDeployments: pullRequestPlanDeploymentsSchema.optional(),
  ttl: ttlSchema.optional()
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

      let environmentId;
      let organizationId;

      try {
        const response = await apiClient.createEnvironment({
          name: ctx.input.name,
          projectId: ctx.input.projectId,
          configurationChanges: ctx.input.variables,
          ttl: ctx.input.ttl,
          requiresApproval: ctx.input.requiresApproval,
          continuousDeployment: ctx.input.continuousDeployment,
          pullRequestPlanDeployments: ctx.input.pullRequestPlanDeployments,
          deployRequest: {
            comment: ctx.input.comment,
            blueprintId: ctx.input.templateId,
          },
        });

        environmentId = response.id;
        organizationId = response.organizationId;

        ctx.logger.info(`env0 environment creation initiated successfully`);
      } catch (error: any) {
        ctx.logger.error(`Failed to create env0 environment`);
        throw extractApiError(error);
      }

      const url = getEnv0EnvironmentUrl({
        environmentId,
        projectId: ctx.input.projectId,
      });

      ctx.logger.info(`Follow the creation progress at ${url}`);
      ctx.output('environmentUrl', url);

      ctx.output('environmentId', environmentId);
      ctx.output('organizationId', organizationId);
    },
  });
}
