import z from 'zod';

import { searchParamsSchema } from '.';

export const formTrainingSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FormTrainingsSchema = z.infer<typeof formTrainingSchema>;
export const getFormTrainingsSchema = z.object({
  ...searchParamsSchema.shape,
  ...formTrainingSchema.shape,
});
export type GetFormTrainingsSchema = z.infer<typeof getFormTrainingsSchema>;

export const createFormTrainingSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Hình thức đào tạo'),
});

export const updateFormTrainingSchema = createFormTrainingSchema;
export type CreateFormTrainingSchema = z.infer<typeof createFormTrainingSchema>;
export type UpdateFormTrainingSchema = z.infer<typeof createFormTrainingSchema>;
