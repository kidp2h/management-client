import z from 'zod';

import { searchParamsSchema } from '.';

export const militaryRankSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type MilitaryRanksSchema = z.infer<typeof militaryRankSchema>;
export const getMilitaryRanksSchema = z.object({
  ...searchParamsSchema.shape,
  ...militaryRankSchema.shape,
});
export type GetMilitaryRanksSchema = z.infer<typeof getMilitaryRanksSchema>;

export const createMilitaryRankSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên quân hàm'),
});

export const updateMilitaryRankSchema = createMilitaryRankSchema;
export type CreateMilitaryRankSchema = z.infer<typeof createMilitaryRankSchema>;
export type UpdateMilitaryRankSchema = z.infer<typeof createMilitaryRankSchema>;
