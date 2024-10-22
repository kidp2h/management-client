import z from 'zod';

import { searchParamsSchema } from '.';

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type RolesSchema = z.infer<typeof roleSchema>;
export const getRolesSchema = z.object({
  ...searchParamsSchema.shape,
  ...roleSchema.shape,
});
export type GetRolesSchema = z.infer<typeof getRolesSchema>;

export const createRoleSchema = z.object({
  name: z
    .string({
      required_error: 'Tên vai trò không được để trống',
    })
    .describe('Tên vai trò'),
});

export const updateRoleSchema = createRoleSchema;
export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
export type UpdateRoleSchema = z.infer<typeof createRoleSchema>;
