'use client';
import { useSignIn } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import type { ClerkAPIError } from '@clerk/types';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { loginSchema } from '@/lib/zod/schemas';
import { useLoading } from '@/providers/loading-provider';
import { ClerkCode } from '@/types';

export const LoginForm = () => {
  const { signIn, setActive } = useSignIn();
  const { setLoading } = useLoading();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>();

  const router = useRouter();
  const [credential, setCredential] = useState<z.infer<
    typeof loginSchema
  > | null>(null);

  const signInWithCode = async ({
    code,
    password,
  }: z.infer<typeof loginSchema>) => {
    try {
      const result = await signIn?.create({
        identifier: code,
        password,
      });
      if (result && result.status === 'complete') {
        await setActive?.({ session: result.createdSessionId });

        router.push('/');
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (errors) {
      switch (errors[0].code) {
        case ClerkCode.NOT_FOUND:
          toast('Tài khoản không tồn tại');
          break;
        default:
          toast('Mã cán bộ hoặc mật khẩu không đúng', {
            description: `${dayjs().format('h:mm A')}`,
            action: {
              label: 'Quên mật khẩu ?',
              onClick: () => console.warn('forgot'),
            },
          });
          break;
      }
    }
  }, [errors]);
  return (
    <AutoForm
      onSubmit={credential => {
        setLoading(true);
        signInWithCode(loginSchema.parse(credential));
      }}
      formSchema={loginSchema}
      fieldConfig={{
        password: {
          inputProps: {
            type: 'password',
            placeholder: 'Mật khẩu',
          },
        },
        code: {
          inputProps: {
            type: 'text',
            placeholder: 'Mã cán bộ',
          },
        },
      }}
    >
      <AutoFormSubmit>Đăng nhập</AutoFormSubmit>
    </AutoForm>
  );
};
