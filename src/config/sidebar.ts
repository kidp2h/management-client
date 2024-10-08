import {
  Bookmark,
  ChartBar,
  LayoutGrid,
  Newspaper,
  Settings,
} from 'lucide-react';

import type { Group } from '@/components/common/sidebar/menu';

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: 'Chính',
      menus: [
        {
          href: '/',
          label: 'Bảng điều khiển',
          active: pathname === '/',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          href: '/records',
          label: 'Quản lý hồ sơ',
          active: pathname.includes('/records'),
          icon: Newspaper,
          submenus: [
            {
              href: '/records',
              label: '1',
            },
            {
              href: '#',
              label: '2',
            },
            {
              href: '#',
              label: '3',
            },
            {
              href: '#',
              label: '4',
            },
            {
              href: '#',
              label: '1',
            },
            {
              href: '#',
              label: '2',
            },
            {
              href: '#',
              label: '3',
            },
            {
              href: '#',
              label: '4',
            },
          ],
        },
        {
          href: '/categories',
          label: 'Quản lý danh mục',
          active: pathname.includes('/categories'),
          icon: Bookmark,
          submenus: [
            {
              href: '/religions',
              label: 'Tôn giáo',
            },
            {
              href: '#',
              label: '2',
            },
            {
              href: '#',
              label: '3',
            },
            {
              href: '#',
              label: '4',
            },
            {
              href: '#',
              label: '1',
            },
            {
              href: '#',
              label: '2',
            },
            {
              href: '#',
              label: '3',
            },
            {
              href: '#',
              label: '4',
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Thống kê',
      menus: [
        {
          href: '/reports',
          label: 'Báo cáo',
          active: pathname.includes('/reports'),
          icon: ChartBar,
        },
      ],
    },
    {
      groupLabel: 'Thống kê',
      menus: [
        {
          href: '/settings',
          label: 'Cài đặt',
          active: pathname.includes('/settings'),
          icon: Settings,
        },
      ],
    },
  ];
}
