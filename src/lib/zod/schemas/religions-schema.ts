import z from 'zod';

import { searchParamsSchema } from '.';

export const religionsSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type ReligionsSchema = z.infer<typeof religionsSchema>;
export const getReligionsSchema = z.object({
  ...searchParamsSchema.shape,
  ...religionsSchema.shape,
});
export type GetReligionsSchema = z.infer<typeof getReligionsSchema>;

export const createReligionSchema = z.object({
  code: z
    .string({
      required_error: 'Mã tôn giáo không được để trống',
    })
    .describe('Mã tôn giáo'),
  name: z
    .string({
      required_error: 'Tên tôn giáo không được để trống',
    })
    .describe('Tên tôn giáo'),
});

export const updateReligionSchema = createReligionSchema;
export type CreateReligionSchema = z.infer<typeof createReligionSchema>;
export type UpdateReligionSchema = z.infer<typeof createReligionSchema>;
