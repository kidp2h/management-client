import z from 'zod';

import { searchParamsSchema } from '.';

export const salaryGradeSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type SalaryGradesSchema = z.infer<typeof salaryGradeSchema>;
export const getSalaryGradesSchema = z.object({
  ...searchParamsSchema.shape,
  ...salaryGradeSchema.shape,
});
export type GetSalaryGradesSchema = z.infer<typeof getSalaryGradesSchema>;

export const createSalaryGradeSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên đơn vị'),
});

export const updateSalaryGradeSchema = createSalaryGradeSchema;
export type CreateSalaryGradeSchema = z.infer<typeof createSalaryGradeSchema>;
export type UpdateSalaryGradeSchema = z.infer<typeof createSalaryGradeSchema>;
