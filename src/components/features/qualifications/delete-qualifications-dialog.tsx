'use client';

import type { Row } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { deleteQualifications } from '@/db/actions/qualifications';
import type { Qualifications } from '@/db/schema';
import { useMediaQuery } from '@/hooks/use-media-query';

interface DeleteQualificationsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  qualifications: Row<Qualifications>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
  name: string;
}

export function DeleteQualificationsDialog({
  qualifications,
  showTrigger = true,
  onSuccess,
  name,
  ...props
}: DeleteQualificationsDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  function onDelete() {
    startDeleteTransition(async () => {
      const { error } = await deleteQualifications({
        ids: qualifications.map(qualification => qualification.id),
      });
      if (error) {
        toast.error(error);
        return;
      }
      props.onOpenChange?.(false);
      toast.success('Trình độ chuyên môn đã được xoá');
      onSuccess?.();
    });
  }
  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Xoá ({qualifications.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn{' '}
              <span className="font-medium">{qualifications.length} </span>
              {name}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Huỷ</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Xoá
            </Button>
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
            Xoá ({qualifications.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn không?</DrawerTitle>
          <DrawerDescription>
            Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn{' '}
            <span className="font-medium">{qualifications.length} </span>
            {name}.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Xoá
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
