import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import {
  createDepartmentSlice,
  type DepartmentSlice,
} from '@/lib/zustand/slices/department-slice';
import {
  createRankSlice,
  type RankSlice,
} from '@/lib/zustand/slices/rank-slice';
import {
  createSidebarSlice,
  type SidebarSlice,
} from '@/lib/zustand/slices/sidebar-slice';
import { createProvinceSlice, ProvinceSlice } from '../slices/province-slice';
import {
  ClassificationSlice,
  createClassificationSlice,
} from '../slices/classification-slice';

export type GlobalStore = SidebarSlice &
  DepartmentSlice &
  RankSlice &
  ProvinceSlice &
  ClassificationSlice;

export const createGlobalStore = () => {
  return createStore<GlobalStore>()(
    devtools(
      persist(
        (set, get, replace) => ({
          ...createSidebarSlice(set, get, replace),
          ...createDepartmentSlice(set, get, replace),
          ...createRankSlice(set, get, replace),
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
