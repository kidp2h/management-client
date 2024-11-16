import type { StateCreator } from 'zustand';

import { getProvinces } from '@/services/api';

export interface ProvinceSlice {
  provinces: Array<any>;
  setProvinces: (provinces: Array<any>) => void;
  fetchProvinces: () => Promise<void>;
}

export const createProvinceSlice: StateCreator<
  ProvinceSlice,
  [],
  []
> = set => ({
  provinces: [],
  setProvinces: (provinces: Array<any>) => set(() => ({ provinces })),
  fetchProvinces: async () => {
    const provinces = await getProvinces();
    set({ provinces });
  },
});
