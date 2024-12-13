import React, { useTransition } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateMetadata } from '@/lib/clerk';
import { updateUserSchema } from '@/lib/zod/schemas/user-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Data, FancyMultiCombobox } from '@/components/ui/fancy-combobox';
import { Roles } from '@/db/schema';
import { Button } from '@/components/ui/button';

export interface UpdateUserFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateUserSchema>>;
  roles: Roles[];
  data: any;
}

export default function UpdateUserForm({
  onSuccess,
  fieldConfig,
  data,
  roles,
}: UpdateUserFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    startUpdateTransition(async () => {
      if (selectedRole.length === 0) {
        toast.error('Vui lòng chọn vai trò');
        return;
      }
      try {
        await updateMetadata(data.id, {
          role: selectedRole.map(role => ({
            id: role.value,
            name: role.label,
          })),
        });
        toast.success('Cập nhật tài khoản thành công');
        onSuccess();
      } catch (error) {
        toast.error('Cập nhật tài khoản thất bại');
      }
    });
  };
  const [selectedRole, setSelectedRole] = React.useState<Data[]>(
    data.publicMetadata?.role?.map(role => {
      return {
        value: role.id,
        label: role.name,
      };
    }) || [],
  );
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema.partial()),
    defaultValues: {},
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
        <Button type="submit">Cập nhật</Button>
      </form>
    </Form>
  );
}
