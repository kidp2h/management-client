import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import {
  createRankSlice,
  type RankSlice,
} from '@/lib/zustand/slices/rank-slice';
import {
  createReligionSlice,
  type ReligionSlice,
} from '@/lib/zustand/slices/religion-slice';
import {
  createSidebarSlice,
  type SidebarSlice,
} from '@/lib/zustand/slices/sidebar-slice';

export type GlobalStore = SidebarSlice & ReligionSlice & RankSlice;

export const createGlobalStore = () => {
  return createStore<GlobalStore>()(
    devtools(
      persist(
        (set, get, replace) => ({
          ...createSidebarSlice(set, get, replace),
          ...createReligionSlice(set, get, replace),
          ...createRankSlice(set, get, replace),
        }),

        {
          name: 'global-store',
          storage: createJSONStorage(() => localStorage),
        },
      ),
    ),
  );
};
