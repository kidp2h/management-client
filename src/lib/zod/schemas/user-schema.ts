import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string({
      required_error: 'Mã cán bộ không được để trống',
    })
    .describe('Mã cán bộ'),
  password: z
    .string()
    .min(8, {
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    })
    .describe('Mật khẩu'),
  email: z
    .string({
      required_error: 'Email không được để trống',
    })
    .email({
      message: 'Email không hợp lệ',
    })
    .describe('Email'),
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
  roles: z.array(z.string()).describe('Vai trò').optional(),
  departments: z.array(z.string()).describe('Phòng ban').optional(),
});
export const updateUserSchema = createUserSchema.omit({
  fullName: true,
  email: true,
  birthday: true,
  username: true,
});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
