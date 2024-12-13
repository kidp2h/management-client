'use client';
import React from 'react';

import { Globe } from '@/components/three/globe';
import { Cover } from '@/components/ui/cover';
import Link from 'next/link';
import ForgotPasswordForm from './forgot-password-form';

export const ForgotPasswordSection = () => {
  return (
    <div className="h-[calc(100vh-3.5rem-3.5rem)]">
      <div className="relative h-full overflow-hidden">
        <div className="px-4 py-5 md:px-24 lg:p-32 xl:p-36">
          <div className="xl:w-1/2">
            {/* Title */}
            <h1 className="scroll-m-20 text-4xl font-extrabold uppercase tracking-tight lg:text-5xl">
              <Cover className="cursor-pointer rounded-lg">Quên mật khẩu</Cover>
            </h1>
            <div className="mt-10">
              <ForgotPasswordForm />
            </div>

            <Link
              href="/auth"
              className="text-muted-foreground mt-5 text-sm block"
            >
              Trở về trang đăng nhập
            </Link>
          </div>
        </div>
        <div>
          <div className="hidden h-full w-1/2 lg:absolute lg:end-0 lg:right-0 lg:top-0 xl:block">
            <Globe />
          </div>
        </div>
      </div>
    </div>
  );
};
