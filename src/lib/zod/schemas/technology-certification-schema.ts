import z from 'zod';

import { searchParamsSchema } from '.';

export const technologyCertificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type TechnologyCertificationsSchema = z.infer<
  typeof technologyCertificationSchema
>;
export const getTechnologyCertificationsSchema = z.object({
  ...searchParamsSchema.shape,
  ...technologyCertificationSchema.shape,
});
export type GetTechnologyCertificationsSchema = z.infer<
  typeof getTechnologyCertificationsSchema
>;

export const createTechnologyCertificationSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên đơn vị'),
});

export const updateTechnologyCertificationSchema =
  createTechnologyCertificationSchema;
export type CreateTechnologyCertificationSchema = z.infer<
  typeof createTechnologyCertificationSchema
>;
export type UpdateTechnologyCertificationSchema = z.infer<
  typeof createTechnologyCertificationSchema
>;
