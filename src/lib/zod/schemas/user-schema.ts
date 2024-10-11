import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string({
      required_error: 'Tên đăng nhập không được để trống',
    })
    .describe('Mã cán bộ'),
  password: z
    .string()
    .min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    })
    .describe('Mật khẩu'),
});
export const updateUserSchema = createUserSchema.extend({});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
