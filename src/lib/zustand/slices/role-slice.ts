import type { StateCreator } from 'zustand';

export interface RoleSlice {
  setRoleAdmin: (id: string[]) => void;
  roleAdmin: string[];
  setRoleApprove: (id: string[]) => void;
  roleApprove: string[];
}
export const createRoleSlice: StateCreator<RoleSlice, [], []> = set => ({
  roleAdmin: [],
  setRoleAdmin: (id: string[]) => set(() => ({ roleAdmin: id })),
  roleApprove: [],
  setRoleApprove: (id: string[]) => set(() => ({ roleApprove: id })),
});
