import z from 'zod';

import { searchParamsSchema } from '.';

export const ethnicitySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type EthnicitiesSchema = z.infer<typeof ethnicitySchema>;
export const getEthnicitiesSchema = z.object({
  ...searchParamsSchema.shape,
  ...ethnicitySchema.shape,
});
export type GetEthnicitiesSchema = z.infer<typeof getEthnicitiesSchema>;

export const createEthnicitySchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên dân tộc'),
});

export const updateEthnicitySchema = createEthnicitySchema;
export type CreateEthnicitySchema = z.infer<typeof createEthnicitySchema>;
export type UpdateEthnicitySchema = z.infer<typeof createEthnicitySchema>;
