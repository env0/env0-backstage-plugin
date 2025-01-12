import { z } from 'zod';

export const variablesSchema = z
  .object({
    id: z.string({
      description: 'The ID of an existing variable to edit.',
    }),
    name: z.string({ description: 'The name of the variable' }),
    value: z.string({ description: 'The value of the variable' }).optional(),
  })
  .catchall(z.any())
  .array();

export const commentSchema = z.string({
  description: 'The comment for the deployment'
});

export const requiresApprovalSchema = z.boolean({
  description: 'Whether the deployment requires approval'
});

export const continuousDeploymentSchema = z.boolean({
  description: 'Enable deploys on merges to target branch'
});

export const pullRequestPlanDeploymentsSchema = z.boolean({
  description: 'Enable plan deployments on pull requests'
});

export const ttlSchema = z.object({
  type: z.enum(['INFINITE', 'HOURS', 'DATE']),
  value: z
    .string({
      description: `Required when the type is not INFINITE. When it's HOURS - attach a stringified number. When it's DATE - format is yyyy-mm-ddThh:MM:ss.000Z (For example 2023-06-04T20:05:00.000Z)`,
    })
    .optional()
});
