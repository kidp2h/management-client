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
                label: 'Hồ sơ CBCCVC',
                active: pathname === '/records',
              },

              // {
              //   href: '/records/commendations',
              //   label: 'Khen thưởng',
              //   active: pathname.includes('/records/commendations'),
              // },
              // {
              //   href: '/records/disciplines',
              //   label: 'Kỷ luật',
              //   active: pathname.includes('/records/disciplines'),
              // },
              // {
              //   href: '/records/remarks',
              //   label: 'Đánh giá',
              //   active: pathname.includes('/records/remarks'),
              // },
              // {
              //   href: '/records/retire',
              //   label: 'Nghỉ hưu',
              //   active: pathname.includes('/records/retire'),
              // },
            ],
          },

          {
            href: '#',
            label: 'Cấu hình',
            active: pathname.includes(''),
            icon: Bookmark,
            submenus: [
              // {
              //   href: '/ranks',
              //   label: 'Cấp bậc',
              // },
              {
                href: '/departments',
                label: 'Cơ quan, Đơn vị',
              },
              {
                href: '/roles',
                label: 'Vai trò',
              },
              {
                href: '/duties',
                label: 'Chức vụ',
              },
              {
                href: '/positions',
                label: 'Vị trí việc làm',
              },
              {
                href: '/religions',
                label: 'Tôn giáo',
              },
              {
                href: '/ethnicities',
                label: 'Dân tộc',
              },
              {
                href: '/academic-qualifications',
                label: 'Học hàm',
              },
              {
                href: '/military-ranks',
                label: 'Quân hàm',
              },
              {
                href: '/qualifications',
                label: 'Trình độ chuyên môn',
              },
              {
                href: '/public-employee-ranks',
                label: 'Ngạch viên chức',
              },
              {
                href: '/civil-servant-ranks',
                label: 'Ngạch công chức',
              },
              {
                href: '/family-backgrounds',
                label: 'Thành phần gia đình',
              },
              {
                href: '/language-certifications',
                label: 'Chứng chỉ ngoại ngữ',
              },
              {
                href: '/technology-certifications',
                label: 'Chứng chỉ tin học',
              },
              {
                href: '/appellations',
                label: 'Danh hiệu, Huân chương, Huy chương',
              },
              {
                href: '/form-disciplines',
                label: 'Hình thức kỷ luật',
              },
              {
                href: '/form-remarks',
                label: 'Hình thức đánh giá',
              },
              {
                href: '/form-retires',
                label: 'Hình thức nghỉ hưu',
              },
              {
                href: '/form-recruitments',
                label: 'Hình thức tuyển dụng',
              },
              {
                href: '/form-trainings',
                label: 'Hình thức đào tạo',
              },
              {
                href: '/salary-grades',
                label: 'Bậc lương',
              },
              {
                href: '/policy-objects',
                label: 'Đối tượng chính sách',
              },
              {
                href: '/salaries',
                label: 'Bảng lương',
              },
              {
                href: '/party-committees',
                label: 'Cấp uỷ',
              },
            ],
          },
          {
            href: '/users',
            label: 'Quản lý tài khoản',
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
