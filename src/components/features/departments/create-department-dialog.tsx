'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { createDepartment } from '@/db/actions/departments';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CaseUpper, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { createDepartmentSchema } from '@/lib/zod/schemas/department-schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface CreateDepartmentsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean;
  cDepartment: Record<string, string>;
  name: string;
}

export function CreateDepartmentsDialog({
  showTrigger = true,
  cDepartment,
  name,
  ...props
}: CreateDepartmentsDialogProps) {
  const [isCreatePending, startCreateTransition] = React.useTransition();

  const isDesktop = useMediaQuery('(min-width: 640px)');
  const form = useForm<z.infer<typeof createDepartmentSchema>>({
    resolver: zodResolver(createDepartmentSchema.partial()),
    defaultValues: {},
  });
  function onCreate(values: z.infer<typeof createDepartmentSchema>) {
    startCreateTransition(async () => {
      try {
        await createDepartment({
          name: values.name,
          parent: cDepartment.id,
        });
        toast.success('Tạo phòng ban thành công');
        // onSuccess();
      } catch (error) {
        toast.error('Tạo phòng ban thất bại');
      }
    });
  }
  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo đơn vị</DialogTitle>
            {/* <DialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn{' '}
              <span className="font-medium">{departments.length} </span>
              {name}.
            </DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCreate)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tên phòng ban, đơn vị</FormLabel>
                    <FormControl>
                      <Input
                        startIcon={CaseUpper}
                        type="text"
                        placeholder="Tên phòng ban"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>Cấp trên: {cDepartment?.name}</div>
              <Button type="submit" className="w-full">
                Tạo
              </Button>
            </form>
          </Form>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Huỷ
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Tạo phòng ban, đơn vị</DrawerTitle>
          {/* <DrawerDescription>
            Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn{' '}
            <span className="font-medium">{departments.length} </span>
            {name}.
          </DrawerDescription> */}
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreate)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tên phòng ban, đơn vị</FormLabel>
                  <FormControl>
                    <Input
                      startIcon={CaseUpper}
                      type="text"
                      placeholder="Tên phòng ban, đơn vị"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Tạo
            </Button>
          </form>
        </Form>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Huỷ
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
