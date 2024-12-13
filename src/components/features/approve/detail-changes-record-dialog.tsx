'use client';

import * as React from 'react';

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
import { useMediaQuery } from '@/hooks/use-media-query';
import { fields } from '@/config/field';

interface DetailChangesRecordDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  approve: any;
  showTrigger?: boolean;
  onSuccess?: () => void;
  name: string;
}

export function DetailChangesRecordDialog({
  approve,
  showTrigger = true,
  onSuccess,
  name,
  ...props
}: DetailChangesRecordDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  // function onDelete() {
  //   startDeleteTransition(async () => {
  //     let data = approve.data;
  //     data = {
  //       ...data,
  //       birthday: data.birthday ? new Date(data.birthday) : null,
  //       createdAt: data.createdAt ? new Date(data.createdAt) : null,
  //       updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
  //       dateOfJoiningOrganization: data.dateOfJoiningOrganization
  //         ? new Date(data.dateOfJoiningOrganization)
  //         : null,
  //       dateOfficialJoiningParty: data.dateOfficialJoiningParty
  //         ? new Date(data.dateOfficialJoiningParty)
  //         : null,
  //       dateOfJoiningCurrentWorkPlace: data.dateOfJoiningCurrentWorkPlace
  //         ? new Date(data.dateOfJoiningCurrentWorkPlace)
  //         : null,
  //       dateOfIssue: data.dateOfIssue ? new Date(data.dateOfIssue) : null,
  //       dateOfEnlistment: data.dateOfEnlistment
  //         ? new Date(data.dateOfEnlistment)
  //         : null,
  //       dateOfEntilement: data.dateOfEntilement
  //         ? new Date(data.dateOfEntilement)
  //         : null,
  //       dateJoiningParty: data.dateJoiningParty
  //         ? new Date(data.dateJoiningParty)
  //         : null,
  //       dateJoiningRevolutionary: data.dateJoiningRevolutionary
  //         ? new Date(data.dateJoiningRevolutionary)
  //         : null,
  //       dateOfAppointment: data.dateOfAppointment
  //         ? new Date(data.dateOfAppointment)
  //         : null,
  //       dateHired: data.dateHired ? new Date(data.dateHired) : null,
  //       dateOfDemobilization: data.dateOfDemobilization
  //         ? new Date(data.dateOfDemobilization)
  //         : null,
  //     };
  //     console.log(data);
  //     // return;
  //     const { error } = await approveRecordByData(approve.id, data);
  //     if (error) {
  //       toast.error(error);
  //       return;
  //     }
  //     props.onOpenChange?.(false);
  //     toast.success('Hồ sơ đã được duyệt');
  //     onSuccess?.();
  //   });
  // }
  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Duyệt hồ sơ
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết sự thay đổi hồ sơ</DialogTitle>
            <DialogDescription>
              Những thông tin được thay đổi sẽ xuất hiện ở dưới đây
            </DialogDescription>
          </DialogHeader>
          {/* {JSON.stringify(approve.changes)} */}
          {approve?.changes?.map(change => (
            <div key={change.key}>
              <span className="text-wrap text-sm">
                {fields?.[change.key] || change.key}:{' '}
                {/* {change.oldValue?.split('.').length > 1
                  ? change.oldValue?.split('.')?.[1] || ''
                  : change.oldValue}{' '} */}
                -&gt;{' '}
                {change.newValue?.split('.').length > 1
                  ? change.newValue?.split('.')?.[1] || ''
                  : change.newValue}
              </span>
            </div>
          ))}
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              {/* <Button variant="outline">Huỷ</Button> */}
            </DialogClose>
            {/* <Button
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
              Duyệt
            </Button> */}
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
            Duyệt hồ sơ
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn không?</DrawerTitle>
          <DrawerDescription>
            Hành động này không thể hoàn tác.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DrawerClose>
          {/* <Button
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
            Duyệt
          </Button> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
