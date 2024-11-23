import z from 'zod';

import { searchParamsSchema } from '.';

export const formRemarkSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FormRemarksSchema = z.infer<typeof formRemarkSchema>;
export const getFormRemarksSchema = z.object({
  ...searchParamsSchema.shape,
  ...formRemarkSchema.shape,
});
export type GetFormRemarksSchema = z.infer<typeof getFormRemarksSchema>;

export const createFormRemarkSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức đánh giá'),
});

export const updateFormRemarkSchema = createFormRemarkSchema;
export type CreateFormRemarkSchema = z.infer<typeof createFormRemarkSchema>;
export type UpdateFormRemarkSchema = z.infer<typeof createFormRemarkSchema>;
