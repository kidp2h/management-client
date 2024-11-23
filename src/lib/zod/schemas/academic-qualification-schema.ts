import z from 'zod';

import { searchParamsSchema } from '.';

export const academicQualificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type AcademicQualificationsSchema = z.infer<
  typeof academicQualificationSchema
>;
export const getAcademicQualificationsSchema = z.object({
  ...searchParamsSchema.shape,
  ...academicQualificationSchema.shape,
});
export type GetAcademicQualificationsSchema = z.infer<
  typeof getAcademicQualificationsSchema
>;

export const createAcademicQualificationSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên đơn vị'),
});

export const updateAcademicQualificationSchema =
  createAcademicQualificationSchema;
export type CreateAcademicQualificationSchema = z.infer<
  typeof createAcademicQualificationSchema
>;
export type UpdateAcademicQualificationSchema = z.infer<
  typeof createAcademicQualificationSchema
>;
