import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import {
  createDepartmentSlice,
  type DepartmentSlice,
} from '@/lib/zustand/slices/department-slice';

import {
  createSidebarSlice,
  type SidebarSlice,
} from '@/lib/zustand/slices/sidebar-slice';
import { createProvinceSlice, ProvinceSlice } from '../slices/province-slice';
import {
  ClassificationSlice,
  createClassificationSlice,
} from '../slices/classification-slice';
import { createRoleSlice, RoleSlice } from '../slices/role-slice';

export type GlobalStore = SidebarSlice &
  DepartmentSlice &
  ProvinceSlice &
  RoleSlice &
  ClassificationSlice;

export const createGlobalStore = () => {
  return createStore<GlobalStore>()(
    devtools(
      persist(
        (set, get, replace) => ({
          ...createSidebarSlice(set, get, replace),
          ...createDepartmentSlice(set, get, replace),
          ...createRoleSlice(set, get, replace),
          ...createProvinceSlice(set, get, replace),
          ...createClassificationSlice(set, get, replace),
        }),

        {
          name: 'global-store',
          storage: createJSONStorage(() => localStorage),
        },
      ),
    ),
  );
};
