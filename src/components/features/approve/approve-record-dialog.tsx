'use client';

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
import { useMediaQuery } from '@/hooks/use-media-query';
import { approveRecordByData } from '@/db/actions/records';

interface DeleteDepartmentsDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  approve: any;
  showTrigger?: boolean;
  onSuccess?: () => void;
  name: string;
}

export function ApproveRecordDialog({
  approve,
  showTrigger = true,
  onSuccess,
  name,
  ...props
}: DeleteDepartmentsDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  function onDelete() {
    startDeleteTransition(async () => {
      let data = approve.data;
      data = {
        ...data,
        birthday: data.birthday ? new Date(data.birthday) : undefined,
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
        dateOfJoiningOrganization: data.dateOfJoiningOrganization
          ? new Date(data.dateOfJoiningOrganization)
          : undefined,
        dateOfficialJoiningParty: data.dateOfficialJoiningParty
          ? new Date(data.dateOfficialJoiningParty)
          : undefined,
        dateOfJoiningCurrentWorkPlace: data.dateOfJoiningCurrentWorkPlace
          ? new Date(data.dateOfJoiningCurrentWorkPlace)
          : undefined,
        dateOfIssue: data.dateOfIssue ? new Date(data.dateOfIssue) : undefined,
        dateOfEnlistment: data.dateOfEnlistment
          ? new Date(data.dateOfEnlistment)
          : undefined,
        dateOfEntilement: data.dateOfEntilement
          ? new Date(data.dateOfEntilement)
          : undefined,
        dateJoiningParty: data.dateJoiningParty
          ? new Date(data.dateJoiningParty)
          : undefined,
        dateJoiningRevolutionary: data.dateJoiningRevolutionary
          ? new Date(data.dateJoiningRevolutionary)
          : undefined,
        dateOfAppointment: data.dateOfAppointment
          ? new Date(data.dateOfAppointment)
          : undefined,
        dateHired: data.dateHired ? new Date(data.dateHired) : undefined,
        dateOfDemobilization: data.dateOfDemobilization
          ? new Date(data.dateOfDemobilization)
          : undefined,
        lastIncreaseSalary: data.lastIncreaseSalary
          ? new Date(data.lastIncreaseSalary)
          : undefined,
      };
      console.log(data);
      // return;
      const { error } = await approveRecordByData(approve.id, data);
      if (error) {
        toast.error(error);
        return;
      }
      props.onOpenChange?.(false);
      toast.success('Hồ sơ đã được duyệt');
      onSuccess?.();
    });
  }
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
            <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
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
              Duyệt
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
            Duyệt
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
