import z from 'zod';

import { searchParamsSchema } from '.';

export const formRecruitmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FormRecruitmentsSchema = z.infer<typeof formRecruitmentSchema>;
export const getFormRecruitmentsSchema = z.object({
  ...searchParamsSchema.shape,
  ...formRecruitmentSchema.shape,
});
export type GetFormRecruitmentsSchema = z.infer<
  typeof getFormRecruitmentsSchema
>;

export const createFormRecruitmentSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức tuyển dụng'),
});

export const updateFormRecruitmentSchema = createFormRecruitmentSchema;
export type CreateFormRecruitmentSchema = z.infer<
  typeof createFormRecruitmentSchema
>;
export type UpdateFormRecruitmentSchema = z.infer<
  typeof createFormRecruitmentSchema
>;
