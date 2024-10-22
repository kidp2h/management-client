import {
  Bookmark,
  ChartBar,
  LayoutGrid,
  Newspaper,
  Settings,
  User,
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
          href: '#',
          label: 'Quản lý hồ sơ',
          active: false,
          icon: Newspaper,
          submenus: [
            {
              href: '/records',
              label: 'Quản lý hồ sơ CBCCVC',
              active: pathname === '/records',
            },

            {
              href: '/records/commendations',
              label: 'Thi đua khen thưởng',
              active: pathname.includes('/records/commendations'),
            },
            {
              href: '/records/disciplines',
              label: 'Kỷ luật',
              active: pathname.includes('/records/disciplines'),
            },
            {
              href: '/records/remarks',
              label: 'Đánh giá',
              active: pathname.includes('/records/remarks'),
            },
            {
              href: '/records/retire',
              label: 'Nghỉ hưu',
              active: pathname.includes('/records/retire'),
            },
            {
              href: '/records/regular-salaries',
              label: 'Nâng lương thường xuyên',
              active: pathname.includes('/records/regular-salaries'),
            },
          ],
        },
        {
          href: '/users',
          label: 'Quản lý  tài khoản',
          active: pathname.includes('/users'),
          icon: User,
        },
        {
          href: '/categories',
          label: 'Quản lý danh mục',
          active: pathname.includes('/categories'),
          icon: Bookmark,
          submenus: [
            {
              href: '/languages',
              label: 'Ngôn ngữ',
            },
            {
              href: '/ranks',
              label: 'Cấp bậc',
            },
            {
              href: '/departments',
              label: 'Đơn vị',
            },
            {
              href: '/roles',
              label: 'Vai trò',
            },
            {
              href: '/permissions',
              label: 'Quyền',
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
