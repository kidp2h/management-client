import { Bookmark, Info, LayoutGrid, Newspaper, User } from 'lucide-react';

import type { Group } from '@/components/common/sidebar/menu';
import { encode } from 'js-base64';

export function getMenuList(pathname: string, user?: any): Group[] {
  if (user?.publicMetadata?.roleName === 'Lãnh đạo') {
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
            ],
          },

          {
            href: '/categories',
            label: 'Quản lý khác',
            active: pathname.includes('/categories'),
            icon: Bookmark,
            submenus: [
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
              // {
              //   href: '/permissions',
              //   label: 'Quyền',
              // },
            ],
          },
          {
            href: '/users',
            label: 'Quản lý  tài khoản',
            active: pathname.includes('/users'),
            icon: User,
          },
        ],
      },
      // {
      //   groupLabel: 'Thống kê',
      //   menus: [
      //     {
      //       href: '/reports',
      //       label: 'Báo cáo',
      //       active: pathname.includes('/reports'),
      //       icon: ChartBar,
      //     },
      //   ],
      // },
      // {
      //   groupLabel: 'Thống kê',
      //   menus: [
      //     {
      //       href: '/settings',
      //       label: 'Cài đặt',
      //       active: pathname.includes('/settings'),
      //       icon: Settings,
      //     },
      //   ],
      // },
    ];
  }
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
        {
          href: `/record/${encode(user?.publicMetadata?.record?.id || '')}`,
          label: 'Thông tin cá nhân',
          active:
            pathname ===
            `/record/${encode(user?.publicMetadata?.record?.id || '')}`,
          icon: Info,
          submenus: [],
        },
      ],
    },
  ];
}
