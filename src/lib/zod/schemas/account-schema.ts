import { z } from 'zod';

export const updateAccountSchema = () => {
  return z.object({
    firstName: z.string().optional().describe('Tên'),
    lastName: z.string().optional().describe('Họ'),
  });
};

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: 'Mật khẩu hiện tại không được để trống',
    })
    .min(6, {
      message: 'Mật khẩu hiện tại phải có ít nhất 8 ký tự',
    })
    .describe('Mật khẩu hiện tại'),
  newPassword: z
    .string({
      required_error: 'Mật khẩu mới không được để trống',
    })
    .min(6, {
      message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
    })
    .describe('Mật khẩu mới'),
});
