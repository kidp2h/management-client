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
  fullName: z
    .string({
      required_error: 'Họ và tên không được để trống',
    })
    .describe('Họ và tên'),
  birthday: z
    .date({
      required_error: 'Ngày sinh không được để trống',
    })
    .describe('Ngày sinh'),
});
export const updateUserSchema = createUserSchema.extend({});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
