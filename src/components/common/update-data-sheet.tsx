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
export interface UpdateDataSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  form: ({ onSuccess, fieldConfig, data }: UpdateDataFormProps) => JSX.Element;
  name: string;
  data: any;
  fieldConfig: FieldConfig<any>;
}
export function UpdateDataSheet({
  form: FormUpdate,
  name,
  fieldConfig,
  data,
  ...props
}: UpdateDataSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
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
