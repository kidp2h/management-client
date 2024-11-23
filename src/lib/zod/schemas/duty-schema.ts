import z from 'zod';

import { searchParamsSchema } from '.';

export const dutySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type DutiesSchema = z.infer<typeof dutySchema>;
export const getDutiesSchema = z.object({
  ...searchParamsSchema.shape,
  ...dutySchema.shape,
});
export type GetDutiesSchema = z.infer<typeof getDutiesSchema>;

export const createDutySchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên chức vụ'),
});

export const updateDutySchema = createDutySchema;
export type CreateDutySchema = z.infer<typeof createDutySchema>;
export type UpdateDutySchema = z.infer<typeof createDutySchema>;
