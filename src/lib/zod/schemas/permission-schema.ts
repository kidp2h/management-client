import z from 'zod';

import { searchParamsSchema } from '.';

export const permissionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  created_at: z.string().optional(),
});
export type PermissionsSchema = z.infer<typeof permissionSchema>;
export const getPermissionsSchema = z.object({
  ...searchParamsSchema.shape,
  ...permissionSchema.shape,
});
export type GetPermissionsSchema = z.infer<typeof getPermissionsSchema>;

export const createPermissionSchema = z.object({
  name: z
    .string({
      required_error: 'Tên quyền không được để trống',
    })
    .describe('Tên quyền'),
});

export const updatePermissionSchema = createPermissionSchema;
export type CreatePermissionSchema = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionSchema = z.infer<typeof createPermissionSchema>;
