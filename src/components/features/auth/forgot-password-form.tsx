'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/zod/schemas/account-schema';
import { useSignIn } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Key, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useRouter } from 'next/navigation';
import { sleep } from '@/lib/utils';

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const formReset = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const { isLoaded, signIn, setActive } = useSignIn();
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    toast.promise(
      signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: values.email,
      }) || Promise.reject(null),
      {
        loading: 'Đang gửi mã xác nhận về e-mail',
        success: () => {
          setSuccessfulCreation(true);
          return 'Vui lòng kiểm tra hộp thư trong e-mail';
        },
        error: err => {
          if (err.errors[0].longMessage === 'Identifier is invalid.') {
            return 'Địa chỉ E-mail không tồn tại';
          }
          return 'Gửi mã xác nhận thất bại';
        },
      },
    );
  };
  const onSubmitReset = async (values: z.infer<typeof resetPasswordSchema>) => {
    toast.promise(
      signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: values.code,
        password: values.newPassword,
      }) || Promise.reject(null),
      {
        loading: 'Đang gửi mã xác nhận về e-mail',
        success: () => {
          // setSuccessfulCreation(false);

          return 'Đổi mật khẩu thành công, bạn sẽ được chuyển về trang đăng nhập sau 3 giây';
        },
        error: () => {
          return 'Mã xác nhận không đúng, vui lòng kiểm tra lại';
        },
      },
    );
    sleep(3000).then(() => {
      setActive?.({
        session: null,
      });
      router.push('/auth');
    });
  };
  return (
    <div>
      {!successfulCreation && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-64">
                  <FormLabel>Địa chỉ E-mail</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={Mail}
                      type="text"
                      placeholder="Địa chỉ E-mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-5">
              Xác nhận
            </Button>
          </form>
        </Form>
      )}
      {successfulCreation && (
        <Form {...formReset}>
          <form
            onSubmit={formReset.handleSubmit(onSubmitReset)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={formReset.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã xác nhận</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Nhập mã xác nhận được gửi về {form.getValues().email}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formReset.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="w-64">
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={Key}
                      type="password"
                      placeholder="Mật khẩu mới"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formReset.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-64">
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={Check}
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-5 w-64">
              Đổi mật khẩu
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
