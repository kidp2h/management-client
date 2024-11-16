import type { StateCreator } from 'zustand';

import { getClassifications } from '@/services/api';

export interface ClassificationSlice {
  classifications: Array<any>;
  setClassifications: (classifications: Array<any>) => void;
  fetchClassifications: () => Promise<void>;
}

export const createClassificationSlice: StateCreator<
  ClassificationSlice,
  [],
  []
> = set => ({
  classifications: [],
  setClassifications: (classifications: Array<any>) =>
    set(() => ({ classifications })),
  fetchClassifications: async () => {
    const classifications = await getClassifications();
    set({ classifications });
  },
});
