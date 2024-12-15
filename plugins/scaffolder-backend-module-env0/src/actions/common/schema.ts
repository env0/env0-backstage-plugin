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
  description: 'The comment for the deployment',
});
