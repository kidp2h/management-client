'use memo';
import Link from 'next/link';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export type ItemBreadcrumb =
  | {
      name: string;
      href: string;
    }
  | {
      isSeparator: boolean;
    }
  | {
      name: string;
    };

export interface AutoBreadcrumbProps {
  items: Array<ItemBreadcrumb>;
}
export default React.memo(({ items }: AutoBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          if ('href' in item) {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          } else if ('isSeparator' in item) {
            return item.isSeparator && <BreadcrumbSeparator key={index} />;
          } else {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
});
//  <BreadcrumbItem>
//           <BreadcrumbLink asChild>
//             <Link href="/">Trang chủ</Link>
//           </BreadcrumbLink>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <BreadcrumbPage>Quản lý danh mục</BreadcrumbPage>
//         </BreadcrumbItem>
//         <BreadcrumbSeparator />
//         <BreadcrumbItem>
//           <BreadcrumbPage>Tôn giáo</BreadcrumbPage>
//         </BreadcrumbItem>
