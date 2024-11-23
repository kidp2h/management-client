import z from 'zod';

import { searchParamsSchema } from '.';

export const qualificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type QualificationsSchema = z.infer<typeof qualificationSchema>;
export const getQualificationsSchema = z.object({
  ...searchParamsSchema.shape,
  ...qualificationSchema.shape,
});
export type GetQualificationsSchema = z.infer<typeof getQualificationsSchema>;

export const createQualificationSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên đơn vị'),
});

export const updateQualificationSchema = createQualificationSchema;
export type CreateQualificationSchema = z.infer<
  typeof createQualificationSchema
>;
export type UpdateQualificationSchema = z.infer<
  typeof createQualificationSchema
>;
