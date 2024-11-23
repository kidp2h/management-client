import z from 'zod';

import { searchParamsSchema } from '.';

export const formRetireSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FormRetiresSchema = z.infer<typeof formRetireSchema>;
export const getFormRetiresSchema = z.object({
  ...searchParamsSchema.shape,
  ...formRetireSchema.shape,
});
export type GetFormRetiresSchema = z.infer<typeof getFormRetiresSchema>;

export const createFormRetireSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức nghỉ hưu'),
});

export const updateFormRetireSchema = createFormRetireSchema;
export type CreateFormRetireSchema = z.infer<typeof createFormRetireSchema>;
export type UpdateFormRetireSchema = z.infer<typeof createFormRetireSchema>;
