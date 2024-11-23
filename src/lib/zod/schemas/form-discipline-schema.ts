import z from 'zod';

import { searchParamsSchema } from '.';

export const formDisciplineSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FormDisciplinesSchema = z.infer<typeof formDisciplineSchema>;
export const getFormDisciplinesSchema = z.object({
  ...searchParamsSchema.shape,
  ...formDisciplineSchema.shape,
});
export type GetFormDisciplinesSchema = z.infer<typeof getFormDisciplinesSchema>;

export const createFormDisciplineSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức kỷ luật'),
});

export const updateFormDisciplineSchema = createFormDisciplineSchema;
export type CreateFormDisciplineSchema = z.infer<
  typeof createFormDisciplineSchema
>;
export type UpdateFormDisciplineSchema = z.infer<
  typeof createFormDisciplineSchema
>;
