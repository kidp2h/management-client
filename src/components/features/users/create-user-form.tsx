import { ReloadIcon } from '@radix-ui/react-icons';
import { Key, Mail, TypeOutline, User } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createUser } from '@/lib/clerk';
import { createUserSchema } from '@/lib/zod/schemas/user-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Data, FancyMultiCombobox } from '@/components/ui/fancy-combobox';
import { Departments, Roles } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { flat } from '@/lib/utils';

export interface CreateUserFormProps {
  onSuccess: () => void;
  roles: Roles[];
  departments: Departments[];
}
export default function CreateUserForm({
  onSuccess,
  roles,
  departments,
}: CreateUserFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const [selectedRole, setSelectedRole] = React.useState<Data[]>([]);
  const [selectedDepartment, setSelectedDepartment] = React.useState<Data[]>(
    [],
  );
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof createUserSchema>) => {
    startCreateTransition(async () => {
      // console.log(selectedRole);
      try {
        await createUser(values, selectedRole, selectedDepartment);
        toast.success('Tạo tài khoản thành công');
        onSuccess();
      } catch (error) {
        toast.error('Tạo tài khoản thất bại');
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="font-bold my-5">Phần thông tin tài khoản</div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Mã cán bộ</FormLabel>
              <FormControl>
                <Input
                  startIcon={User}
                  type="text"
                  placeholder="Mã cán bộ"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  startIcon={Key}
                  type="text"
                  placeholder="Mật khẩu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
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

        <div className="font-bold my-5">Phần thông tin cơ bản hồ sơ</div>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  startIcon={TypeOutline}
                  type="text"
                  placeholder="Họ và tên"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày sinh"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Vai trò</FormLabel>
              <FormControl>
                <FancyMultiCombobox
                  className="mt-3"
                  selected={selectedRole}
                  setSelected={setSelectedRole}
                  id="*"
                  placeholder="Chọn vai trò"
                  dataset={
                    roles?.map(role => ({
                      value: role.id,
                      label: role.name,
                    })) || []
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departments"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Phòng ban</FormLabel>
              <FormControl>
                <FancyMultiCombobox
                  className="mt-3"
                  selected={selectedDepartment}
                  setSelected={setSelectedDepartment}
                  id="*"
                  placeholder="Chọn phòng ban"
                  dataset={
                    flat(departments)?.map(d => ({
                      value: d.id,
                      label: d.name,
                    })) || []
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isCreatePending}>
          {isCreatePending && (
            <ReloadIcon
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Tạo tài khoản
        </Button>
      </form>
    </Form>
  );
}
