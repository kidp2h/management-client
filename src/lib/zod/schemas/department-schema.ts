import z from 'zod';

import { searchParamsSchema } from '.';

export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type DepartmentsSchema = z.infer<typeof departmentSchema>;
export const getDepartmentsSchema = z.object({
  ...searchParamsSchema.shape,
  ...departmentSchema.shape,
});
export type GetDepartmentsSchema = z.infer<typeof getDepartmentsSchema>;

export const createDepartmentSchema = z.object({
  name: z
    .string({
      required_error: 'Tên đơn vị không được để trống',
    })
    .describe('Tên đơn vị'),
  parent: z
    .string({
      required_error: 'Đơn vị cha không được để trống',
    })
    .optional(),
});
export const createRecordDepartmentSchema = z.object({
  recordId: z.string({
    required_error: 'Không được để trống',
  }),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();
export type CreateDepartmentSchema = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentSchema = z.infer<typeof updateDepartmentSchema>;
