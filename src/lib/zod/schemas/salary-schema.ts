import z from 'zod';

import { searchParamsSchema } from '.';

export const salarySchema = z.object({
  code: z.string().optional(),
  id: z.string().optional(),
  type: z.enum(['A3.1', 'A3.2', 'A2.1', 'A2.2', 'A1', 'A0']).optional(),
  rank: z.string().optional(),
  factor: z.string().optional(),
  salary: z.string().optional(),
  created_at: z.string().optional(),
});
export type SalariesSchema = z.infer<typeof salarySchema>;
export const getSalariesSchema = z.object({
  ...searchParamsSchema.shape,
  ...salarySchema.shape,
});
export type GetSalariesSchema = z.infer<typeof getSalariesSchema>;

export const createSalarySchema = grades => {
  return z.object({
    type: z
      .enum(['A3.1', 'A3.2', 'A2.1', 'A2.2', 'A1', 'A0'], {
        required_error: 'Không được để trống',
      })
      .describe('Nhóm ngạch'),
    rank: z
      .enum(grades, {
        required_error: 'Không được để trống',
      })
      .describe('Bậc'),
    factor: z
      .string({
        required_error: 'Không được để trống',
      })
      .describe('Hệ số'),
    salary: z
      .string({
        required_error: 'Không được để trống',
      })
      .describe('Lương (nghìn đồng)'),
  });
};

export const updateSalarySchema = createSalarySchema;
export type CreateSalarySchema = z.infer<ReturnType<typeof createSalarySchema>>;
export type UpdateSalarySchema = z.infer<ReturnType<typeof createSalarySchema>>;
