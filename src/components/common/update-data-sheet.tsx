import React from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import type { FieldConfig } from '../ui/auto-form/types';

export interface UpdateDataFormProps {
  onSuccess: () => void;
  fieldConfig: FieldConfig<any>;
  data: any;
}
export interface UpdateDataSheetProps<T extends Record<string, any>>
  extends React.ComponentPropsWithRef<typeof Sheet> {
  form: ({
    onSuccess,
    fieldConfig,
    data,
  }: UpdateDataFormProps & Record<any, any>) => JSX.Element;
  name: string;
  data: T;
  fieldConfig: FieldConfig<T>;
}
export function UpdateDataSheet<T extends Record<string, any>>({
  form: FormUpdate,
  name,
  fieldConfig,
  data,
  ...props
}: UpdateDataSheetProps<T>) {
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 overflow-auto sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Cập nhật {name}</SheetTitle>
          <SheetDescription>
            Cập nhật chi tiết {name.toLowerCase()}
          </SheetDescription>
        </SheetHeader>
        <FormUpdate
          onSuccess={() => {
            props.onOpenChange?.(false);
          }}
          data={data}
          fieldConfig={fieldConfig}
        />
      </SheetContent>
    </Sheet>
  );
}
