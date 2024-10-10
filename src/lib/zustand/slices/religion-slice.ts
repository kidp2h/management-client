import type { StateCreator } from 'zustand';

import type { Religions } from '@/db/schema';

export interface ReligionSlice {
  religions: Religions[];
  setReligions: (religions: Religions[]) => void;
}
export const createReligionSlice: StateCreator<
  ReligionSlice,
  [],
  []
> = set => ({
  religions: [],
  setReligions: (religions: Religions[]) => set(() => ({ religions })),
});
