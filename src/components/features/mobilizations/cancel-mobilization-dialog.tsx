'use client';

import type { Row } from '@tanstack/react-table';
import * as React from 'react';
import { toast } from 'sonner';

import { Icons } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { useMediaQuery } from '@/hooks/use-media-query';

import {
  deleteMobilization,
} from '@/db/actions/mobilizations';

interface CancelMobilizationDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  row: Row<any>['original'];

  onSuccess?: () => void;
}

export function CancelMobilizationDialog({
  row,
  onSuccess,

  ...props
}: CancelMobilizationDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  function onSubmit() {
    startTransition(async () => {
      const { error } = await deleteMobilization({
        id: row.id,
      });
      if (!error) {
        toast.success('Huỷ điều động thành công');
      } else {
        toast.error('Huỷ điều động thất bại. Vui lòng thử lại sau');
      }
      props.onOpenChange?.(false);
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ huỷ điều động.
            </DialogDescription>
          </DialogHeader>
          {/* {formComponent} */}
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Huỷ</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onSubmit}
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn không?</DrawerTitle>
          <DrawerDescription>
            Hành động này không thể hoàn tác. Điều này sẽ huỷ điều động.
          </DrawerDescription>
        </DrawerHeader>
        {/* {formComponent} */}
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Xác nhận
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
