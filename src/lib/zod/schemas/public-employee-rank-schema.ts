import z from 'zod';

import { searchParamsSchema } from '.';

export const publicEmployeeRankSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  type: z.enum(['A3.1', 'A3.2', 'A2.1', 'A2.2', 'A1', 'A0']).optional(),
  created_at: z.string().optional(),
});
export type PublicEmployeeRanksSchema = z.infer<
  typeof publicEmployeeRankSchema
>;
export const getPublicEmployeeRanksSchema = z.object({
  ...searchParamsSchema.shape,
  ...publicEmployeeRankSchema.shape,
});
export type GetPublicEmployeeRanksSchema = z.infer<
  typeof getPublicEmployeeRanksSchema
>;

export const createPublicEmployeeRankSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên ngạch viên chức'),
  type: z
    .enum(['A3.1', 'A3.2', 'A2.1', 'A2.2', 'A1', 'A0'], {
      required_error: 'Không được để trống',
    })
    .describe('Nhóm ngạch'),
});

export const updatePublicEmployeeRankSchema = createPublicEmployeeRankSchema;
export type CreatePublicEmployeeRankSchema = z.infer<
  typeof createPublicEmployeeRankSchema
>;
export type UpdatePublicEmployeeRankSchema = z.infer<
  typeof createPublicEmployeeRankSchema
>;
