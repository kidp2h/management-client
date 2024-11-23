import z from 'zod';

import { searchParamsSchema } from '.';

export const appellationSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type AppellationsSchema = z.infer<typeof appellationSchema>;
export const getAppellationsSchema = z.object({
  ...searchParamsSchema.shape,
  ...appellationSchema.shape,
});
export type GetAppellationsSchema = z.infer<typeof getAppellationsSchema>;

export const createAppellationSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên đơn vị'),
});

export const updateAppellationSchema = createAppellationSchema;
export type CreateAppellationSchema = z.infer<typeof createAppellationSchema>;
export type UpdateAppellationSchema = z.infer<typeof createAppellationSchema>;
