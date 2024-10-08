'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { LogOut, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import AccountSection from '../features/account/account-section';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Skeleton } from '../ui/skeleton';

export function UserNav() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  return (
    <Sheet>
      <SheetContent className="w-full overflow-y-auto ">
        <SheetHeader>
          <SheetTitle>Thông tin tài khoản</SheetTitle>
          <SheetDescription>
            Bạn có thể thay đổi thông tin cá nhân của mình tại đây.
          </SheetDescription>
        </SheetHeader>
        <AccountSection />
      </SheetContent>

      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative size-8 rounded-full"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={`${user?.imageUrl}`} alt="Avatar" />
                    <AvatarFallback className="bg-transparent">
                      <Skeleton className="size-full rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Tài khoản</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {!isLoaded || !user?.fullName ? (
                  <Skeleton className="mb-2 h-3 w-full" />
                ) : (
                  user?.fullName
                )}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <SheetTrigger className="w-full">
                <User className="mr-3 size-4 text-muted-foreground" />
                Tài khoản của tôi
              </SheetTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => signOut({ redirectUrl: '/auth' })}
          >
            <LogOut className="mr-3 size-4 text-muted-foreground" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Sheet>
  );
}
