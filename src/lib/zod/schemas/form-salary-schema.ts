import z from 'zod';

import { searchParamsSchema } from '.';

export const formSalarySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FormSalarySchema = z.infer<typeof formSalarySchema>;
export const getFormSalarySchema = z.object({
  ...searchParamsSchema.shape,
  ...formSalarySchema.shape,
});
export type GetFormSalarySchema = z.infer<typeof getFormSalarySchema>;

export const createFormSalarySchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức hưởng lương'),
});

export const updateFormSalarySchema = createFormSalarySchema;
export type CreateFormSalarySchema = z.infer<typeof createFormSalarySchema>;
export type UpdateFormSalarySchema = z.infer<typeof createFormSalarySchema>;
