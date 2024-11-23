import z from 'zod';

import { searchParamsSchema } from '.';

export const civilServantRankSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(['A3.1', 'A3.2', 'A2.1', 'A2.2', 'A1', 'A0']).optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type CivilServantRanksSchema = z.infer<typeof civilServantRankSchema>;
export const getCivilServantRanksSchema = z.object({
  ...searchParamsSchema.shape,
  ...civilServantRankSchema.shape,
});
export type GetCivilServantRanksSchema = z.infer<
  typeof getCivilServantRanksSchema
>;

export const createCivilServantRankSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên ngạch công chức'),
  type: z
    .enum(['A3.1', 'A3.2', 'A2.1', 'A2.2', 'A1', 'A0'], {
      required_error: 'Không được để trống',
    })
    .describe('Nhóm ngạch'),
});

export const updateCivilServantRankSchema = createCivilServantRankSchema;
export type CreateCivilServantRankSchema = z.infer<
  typeof createCivilServantRankSchema
>;
export type UpdateCivilServantRankSchema = z.infer<
  typeof createCivilServantRankSchema
>;
