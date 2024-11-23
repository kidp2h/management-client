import z from 'zod';

import { searchParamsSchema } from '.';

export const formCommendationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FormCommendationsSchema = z.infer<typeof formCommendationSchema>;
export const getFormCommendationsSchema = z.object({
  ...searchParamsSchema.shape,
  ...formCommendationSchema.shape,
});
export type GetFormCommendationsSchema = z.infer<
  typeof getFormCommendationsSchema
>;

export const createFormCommendationSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức khen thưởng'),
});

export const updateFormCommendationSchema = createFormCommendationSchema;
export type CreateFormCommendationSchema = z.infer<
  typeof createFormCommendationSchema
>;
export type UpdateFormCommendationSchema = z.infer<
  typeof createFormCommendationSchema
>;
