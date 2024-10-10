'use client';
import { useUser } from '@clerk/nextjs';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import React, { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Icons } from '@/components/common/icons';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleClerkException } from '@/lib/utils';
import {
  updateAccountSchema,
  updatePasswordSchema,
} from '@/lib/zod/schemas/account-schema';

export default React.memo(() => {
  const { user, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>(user?.imageUrl || '');

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpdatePassword = async (
    values: z.infer<typeof updatePasswordSchema>,
  ) => {
    try {
      await user?.updatePassword(values);
      toast.success('Mật khẩu đã được cập nhật');
    } catch (error) {
      handleClerkException(error, () => {
        toast.error('Mật khẩu không đúng');
      });
    }
  };
  const handleUpdateAccount = async (
    values: z.infer<typeof updateAccountSchema>,
  ) => {
    try {
      await user?.update({
        firstName: isEmpty(values.firstName)
          ? user?.firstName || ''
          : values.firstName,
        lastName: isEmpty(values.lastName)
          ? user?.lastName || ''
          : values.lastName,
      });
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      handleClerkException(error, () => {
        toast.error('Cập nhật thông tin thất bại');
      });
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        toast.error('Vui lòng chọn file ảnh nhỏ hơn 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận file ảnh');
        return;
      }
      startTransition(async () => {
        try {
          // Convert the file to a base64 string
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64String = reader.result as string;
            // Update the user's avatar
            // await user?.update({ imageUrl: base64String });
            await user?.setProfileImage({
              file: base64String,
            });
            setImageUrl(base64String);
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error(error);
        }
      });
    }
  };
  return (
    <div className="mt-10 ">
      <div className="flex flex-col items-center gap-4 ">
        {}
        <div className="relative flex size-24 items-center justify-center">
          {isPending ? (
            <div>
              <Icons.spinner
                className="size-4 animate-spin "
                aria-hidden="true"
              />
            </div>
          ) : !isLoaded || user?.imageUrl === '' ? (
            <Icons.spinner
              className="size-4 animate-spin "
              aria-hidden="true"
            />
          ) : (
            <Image
              src={imageUrl}
              quality={100}
              fill
              alt="avatar"
              className="absolute cursor-pointer rounded-full ring-2 ring-card-foreground"
              onClick={handleButtonClick}
            />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-5 flex flex-col gap-5">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Thông tin tài khoản</TabsTrigger>
            <TabsTrigger value="password">Mật khẩu</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin</CardTitle>
                <CardDescription>
                  Thay đổi thông tin tài khoản của bạn ở đây.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {!isLoaded ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <AutoForm
                    formSchema={updateAccountSchema}
                    resetOnSubmit={false}
                    fieldConfig={{
                      firstName: {
                        inputProps: {
                          placeholder: user?.firstName || 'Tên',
                        },
                      },
                      lastName: {
                        inputProps: {
                          placeholder: user?.lastName || 'Họ',
                        },
                      },
                    }}
                    onSubmit={values => {
                      handleUpdateAccount(values);
                    }}
                  >
                    <AutoFormSubmit>Lưu thay đổi</AutoFormSubmit>
                  </AutoForm>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Mật khẩu</CardTitle>
                <CardDescription>
                  Thay đổi mật khẩu của bạn ở đây.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {!isLoaded ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <AutoForm
                    formSchema={updatePasswordSchema}
                    onSubmit={values => {
                      handleUpdatePassword(values);
                    }}
                    fieldConfig={{
                      newPassword: {
                        inputProps: {
                          type: 'password',
                          placeholder: 'Mật khẩu mới',
                        },
                      },
                      currentPassword: {
                        inputProps: {
                          type: 'password',
                          placeholder: 'Mật khẩu hiện tại',
                        },
                      },
                    }}
                  >
                    <AutoFormSubmit>Lưu mật khẩu</AutoFormSubmit>
                  </AutoForm>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});
