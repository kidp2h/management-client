import { ReloadIcon } from '@radix-ui/react-icons';
import { Key, TypeOutline, User } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createUser } from '@/lib/clerk';
import { createUserSchema } from '@/lib/zod/schemas/user-schema';

export interface CreateUserFormProps {
  onSuccess: () => void;
}
export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          try {
            await createUser({
              username: values.username,
              password: values.password,
              birthday: values.birthday,
              fullName: values.fullName,
            });
            onSuccess();
            toast.success('Tài khoản đã được tạo');
          } catch (error) {
            console.error(error);
            toast.error('Tạo tài khoản thất bại');
          }
        });
      }}
      formSchema={createUserSchema}
      fieldConfig={{
        username: {
          icon: User,
          inputProps: {
            placeholder: 'Mã cán bộ',
          },
        },
        password: {
          icon: Key,
          inputProps: {
            placeholder: 'Mật khẩu',
          },
        },
        fullName: {
          inputProps: {
            placeholder: 'Họ và tên',
          },
          icon: TypeOutline,
        },
        birthday: {
          inputProps: {
            placeholder: 'Ngày sinh',
          },
        },
      }}
    >
      <AutoFormSubmit
        disabled={isCreatePending}
        className="w-full bg-primary text-primary-foreground"
      >
        {isCreatePending && (
          <ReloadIcon className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        Tạo
      </AutoFormSubmit>
    </AutoForm>
  );
}
