import z from 'zod';

import { searchParamsSchema } from '.';

export const typeContractSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type TypeContractsSchema = z.infer<typeof typeContractSchema>;
export const getTypeContractsSchema = z.object({
  ...searchParamsSchema.shape,
  ...typeContractSchema.shape,
});
export type GetTypeContractsSchema = z.infer<typeof getTypeContractsSchema>;

export const createTypeContractSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên loại hợp đồng'),
});

export const updateTypeContractSchema = createTypeContractSchema;
export type CreateTypeContractSchema = z.infer<typeof createTypeContractSchema>;
export type UpdateTypeContractSchema = z.infer<typeof createTypeContractSchema>;
