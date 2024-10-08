'use client';
import { useSignIn } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import type { ClerkAPIError } from '@clerk/types';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'sonner';
import type { z } from 'zod';

import { env } from '@/../env.mjs';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { loginSchema } from '@/lib/zod/schemas';
import { useLoading } from '@/providers/loading-provider';
import { ClerkCode } from '@/types';

export const LoginForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { setLoading } = useLoading();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>();

  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [credential, setCredential] = useState<z.infer<
    typeof loginSchema
  > | null>(null);

  const signInWithCode = async ({
    code,
    password,
  }: z.infer<typeof loginSchema>) => {
    if (!isLoaded) {
      return;
    }
    try {
      const result = await signIn.create({
        identifier: code,
        password,
      });
      console.log(result);
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });

        router.push('/');
      }
      setLoading(false);
    } catch (err) {
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
              onClick: () => console.log('Undo'),
            },
          });
          break;
      }
    }
  }, [errors]);
  function handleExpired() {
    setIsVerified(false);
  }
  async function handleCaptchaSubmission(token: string | null) {
    console.log(isVerified);
    try {
      if (token) {
        await fetch('/api/captcha', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        setIsVerified(true);
      }
    } catch (e) {
      console.log(e);
      setIsVerified(false);
    }
  }

  useEffect(() => {
    if (isVerified) {
      recaptchaRef.current?.reset();
      if (credential) {
        signInWithCode(loginSchema.parse(credential));
      } else {
        toast('Vui lòng nhập mã cán bộ và mật khẩu');
      }
    }
  }, [isVerified, router]);

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };
  return (
    <AutoForm
      onSubmit={credential => {
        setLoading(true);
        setIsVerified(false);
        recaptchaRef.current?.execute();
        setCredential(credential);
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
      <ReCAPTCHA
        sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
        ref={recaptchaRef}
        onChange={handleChange}
        size="invisible"
        className="fixed bottom-0 z-50"
        onExpired={handleExpired}
      />
      <AutoFormSubmit>Đăng nhập</AutoFormSubmit>
    </AutoForm>
  );
};
