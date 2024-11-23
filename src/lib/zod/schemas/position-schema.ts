import z from 'zod';

import { searchParamsSchema } from '.';

export const positionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type PositionsSchema = z.infer<typeof positionSchema>;
export const getPositionsSchema = z.object({
  ...searchParamsSchema.shape,
  ...positionSchema.shape,
});
export type GetPositionsSchema = z.infer<typeof getPositionsSchema>;

export const createPositionSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Tên vị trí việc làm'),
});

export const updatePositionSchema = createPositionSchema;
export type CreatePositionSchema = z.infer<typeof createPositionSchema>;
export type UpdatePositionSchema = z.infer<typeof createPositionSchema>;
