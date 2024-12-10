import { z } from 'zod';

export const variablesSchema = z
  .object({
    id: z
      .string({
        description:
          'The ID of an existing variable to override. When not used, will create a new variable',
      })
      .optional(),
    name: z.string({ description: 'The name of the variable' }),
    value: z.string({ description: 'The value of the variable' }).optional(),
    type: z.union([z.literal(1), z.literal(0)], {
      description: 'The type of the variable; 0 - TF Var, 1 - Env Var',
    }),
    isSensitive: z.boolean({
      description: 'Whether the variable is sensitive',
    }),
    isRequired: z.boolean({ description: 'Whether the variable is required' }),
  })
  .array();

export const commentSchema = z.string({
  description: 'The comment for the deployment',
});
