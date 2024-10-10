import type { StateCreator } from 'zustand';

import type { Ranks } from '@/db/schema';

export interface RankSlice {
  ranks: Ranks[];
  setRanks: (ranks: Ranks[]) => void;
}
export const createRankSlice: StateCreator<RankSlice, [], []> = set => ({
  ranks: [],
  setRanks: (ranks: Ranks[]) => set(() => ({ ranks })),
});
