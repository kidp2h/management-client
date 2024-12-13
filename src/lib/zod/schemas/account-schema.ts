import { z } from 'zod';

export const updateAccountSchema = z.object({
  firstName: z.string().optional().describe('Tên'),
  lastName: z.string().optional().describe('Họ'),
});

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

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email không được để trống',
    })
    .email({
      message: 'Email không hợp lệ',
    }),
});

export const resetPasswordSchema = z
  .object({
    code: z
      .string({
        required_error: 'Mã xác nhận không được để trống',
      })
      .describe('Mã xác nhận'),
    newPassword: z
      .string({
        required_error: 'Mật khẩu mới không được để trống',
      })
      .min(8, {
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
      })
      .describe('Mật khẩu mới'),
    confirmPassword: z
      .string({
        required_error: 'Xác nhận mật khẩu không được để trống',
      })
      .min(8, {
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
      })
      .describe('Xác nhận mật khẩu'),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không trùng khớp',
        path: ['confirmPassword'],
      });
    }
  });
