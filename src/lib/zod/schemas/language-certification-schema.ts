import z from 'zod';

import { searchParamsSchema } from '.';

export const languageCertificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type LanguageCertificationsSchema = z.infer<
  typeof languageCertificationSchema
>;
export const getLanguageCertificationsSchema = z.object({
  ...searchParamsSchema.shape,
  ...languageCertificationSchema.shape,
});
export type GetLanguageCertificationsSchema = z.infer<
  typeof getLanguageCertificationsSchema
>;

export const createLanguageCertificationSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên chứng chỉ'),
});

export const updateLanguageCertificationSchema =
  createLanguageCertificationSchema;
export type CreateLanguageCertificationSchema = z.infer<
  typeof createLanguageCertificationSchema
>;
export type UpdateLanguageCertificationSchema = z.infer<
  typeof createLanguageCertificationSchema
>;
