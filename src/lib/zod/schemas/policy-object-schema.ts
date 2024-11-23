import z from 'zod';

import { searchParamsSchema } from '.';

export const policyObjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type PolicyObjectsSchema = z.infer<typeof policyObjectSchema>;
export const getPolicyObjectsSchema = z.object({
  ...searchParamsSchema.shape,
  ...policyObjectSchema.shape,
});
export type GetPolicyObjectsSchema = z.infer<typeof getPolicyObjectsSchema>;

export const createPolicyObjectSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Đối tượng chính sách'),
});

export const updatePolicyObjectSchema = createPolicyObjectSchema;
export type CreatePolicyObjectSchema = z.infer<typeof createPolicyObjectSchema>;
export type UpdatePolicyObjectSchema = z.infer<typeof createPolicyObjectSchema>;
