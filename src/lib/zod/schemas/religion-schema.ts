import z from 'zod';

import { searchParamsSchema } from '.';

export const religionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type ReligionsSchema = z.infer<typeof religionSchema>;
export const getReligionsSchema = z.object({
  ...searchParamsSchema.shape,
  ...religionSchema.shape,
});
export type GetReligionsSchema = z.infer<typeof getReligionsSchema>;

export const createReligionSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên đơn vị'),
});

export const updateReligionSchema = createReligionSchema;
export type CreateReligionSchema = z.infer<typeof createReligionSchema>;
export type UpdateReligionSchema = z.infer<typeof createReligionSchema>;
