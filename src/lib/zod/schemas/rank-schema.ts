import z from 'zod';

import { searchParamsSchema } from '.';

export const rankSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type RanksSchema = z.infer<typeof rankSchema>;
export const getRanksSchema = z.object({
  ...searchParamsSchema.shape,
  ...rankSchema.shape,
});
export type GetRanksSchema = z.infer<typeof getRanksSchema>;

export const createRankSchema = z.object({
  code: z
    .string({
      required_error: 'Mã cấp bậc không được để trống',
    })
    .describe('Mã cấp bậc'),
  name: z
    .string({
      required_error: 'Tên cấp bậc không được để trống',
    })
    .describe('Tên cấp bậc'),
});

export const updateRankSchema = createRankSchema;
export type CreateRankSchema = z.infer<typeof createRankSchema>;
export type UpdateRankSchema = z.infer<typeof createRankSchema>;
