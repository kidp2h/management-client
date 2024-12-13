import { Bookmark, Info, LayoutGrid, Newspaper, User } from 'lucide-react';

import type { Group } from '@/components/common/sidebar/menu';
import { encode } from 'js-base64';

export function getMenuList(
  pathname: string,
  roleAdminIds: string[] | null,
  rolesCanApprove: string[] | null,
  user?: any,
): Group[] {
  const userRoles = user?.publicMetadata.role || [];
  // console.log(user?.publicMetadata, 'roleAdmin ne', roleAdminId);
  // user?.publicMetadata.role is array role, check that array role is in roleAdminId
  const isAdmin = userRoles.some(role => roleAdminIds?.includes(role.id));
  const isCanApprove = userRoles.some(role =>
    rolesCanApprove?.includes(role.id),
  );
  const base = [
    {
      groupLabel: `Chính `,
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
  ];
  let result: any[] = [...base];

  if (isAdmin) {
    result = [
      ...result,
      {
        groupLabel: 'Quản lý',
        menus: [
          {
            href: '#',
            label: 'Quản lý',
            active: false,
            icon: Newspaper,
            submenus: [
              {
                href: '/records',
                label: 'Hồ sơ CBCCVC',
                active: pathname === '/records',
              },
              {
                href: '/users',
                label: 'Quản lý tài khoản',
                active: pathname.includes('/users'),
                icon: User,
              },
              // {
              //   href: '/records/retire',
              //   label: 'Nghỉ hưu',
              //   active: pathname === '/records/retire',
              // },
            ],
          },

          {
            href: '#',
            label: 'Cấu hình',
            active: false,
            icon: Bookmark,
            submenus: [
              {
                href: '/departments',
                label: 'Tổ chức, Cơ quan, Đơn vị',
                active: pathname.includes('/departments'),
              },
              {
                href: '/roles',
                label: 'Vai trò',
                active: pathname.includes('/roles'),
              },
              {
                href: '/duties',
                label: 'Chức vụ',
                active: pathname.includes('/duties'),
              },
              {
                href: '/positions',
                label: 'Vị trí việc làm',
                active: pathname.includes('/positions'),
              },
              {
                href: '/religions',
                label: 'Tôn giáo',
                active: pathname.includes('/religions'),
              },
              {
                href: '/ethnicities',
                label: 'Dân tộc',
                active: pathname.includes('/ethnicities'),
              },
              {
                href: '/military-ranks',
                label: 'Quân hàm',
                active: pathname.includes('/military-ranks'),
              },
              {
                href: '/qualifications',
                label: 'Trình độ chuyên môn',
                active: pathname.includes('/qualifications'),
              },
              {
                href: '/public-employee-ranks',
                label: 'Ngạch viên chức',
                active: pathname.includes('/public-employee-ranks'),
              },
              {
                href: '/civil-servant-ranks',
                label: 'Ngạch công chức',
                active: pathname.includes('/civil-servant-ranks'),
              },
              {
                href: '/family-backgrounds',
                label: 'Thành phần gia đình',
                active: pathname.includes('/family-backgrounds'),
              },
              {
                href: '/languages',
                label: 'Ngôn ngữ',
                active: pathname.includes('/languages'),
              },

              {
                href: '/appellations',
                label: 'Danh hiệu, Huân chương, Huy chương',
                active: pathname.includes('/appellations'),
              },
              {
                href: '/form-disciplines',
                label: 'Hình thức kỷ luật',
                active: pathname.includes('/form-disciplines'),
              },
              {
                href: '/form-remarks',
                label: 'Hình thức đánh giá',
                active: pathname.includes('/form-remarks'),
              },
              // {
              //   href: '/form-retires',
              //   label: 'Hình thức nghỉ hưu',
              // },
              {
                href: '/form-recruitments',
                label: 'Hình thức tuyển dụng',
                active: pathname.includes('/form-recruitments'),
              },
              {
                href: '/form-trainings',
                label: 'Hình thức đào tạo',
                active: pathname.includes('/form-trainings'),
              },
              {
                href: '/form-salary',
                label: 'Hình thức hưởng lương',
                active: pathname.includes('/form-salary'),
              },
              {
                href: '/salary-grades',
                label: 'Bậc lương',
                active: pathname.includes('/salary-grades'),
              },
              {
                href: '/type-contracts',
                label: 'Loại hợp đồng',
                active: pathname.includes('/type-contracts'),
              },

              {
                href: '/party-committees',
                label: 'Cấp uỷ',
                active: pathname.includes('/party-committees'),
              },
            ],
          },
        ],
      },
    ];
  }
  if (isCanApprove) {
    console.log('isCanApprove');
    result = [
      ...result,
      {
        menus: [
          {
            href: '/approve',
            label: 'Duyệt hồ sơ',
            active: false,
            icon: Newspaper,
          },
        ],
      },
    ];
  }
  if (!isAdmin && !isCanApprove) {
    return [
      ...base,
      {
        groupLabel: `Chính `,
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
  return result;

  // return result;
}
