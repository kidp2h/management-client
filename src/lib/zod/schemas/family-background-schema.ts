import z from 'zod';

import { searchParamsSchema } from '.';

export const familyBackgroundSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type FamilyBackgroundsSchema = z.infer<typeof familyBackgroundSchema>;
export const getFamilyBackgroundsSchema = z.object({
  ...searchParamsSchema.shape,
  ...familyBackgroundSchema.shape,
});
export type GetFamilyBackgroundsSchema = z.infer<
  typeof getFamilyBackgroundsSchema
>;

export const createFamilyBackgroundSchema = z.object({
  name: z
    .string({
      required_error: 'Không được để trống',
    })
    .describe('Gia đình xuất thân'),
});

export const updateFamilyBackgroundSchema = createFamilyBackgroundSchema;
export type CreateFamilyBackgroundSchema = z.infer<
  typeof createFamilyBackgroundSchema
>;
export type UpdateFamilyBackgroundSchema = z.infer<
  typeof createFamilyBackgroundSchema
>;
