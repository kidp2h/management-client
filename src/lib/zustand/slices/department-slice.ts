import type { StateCreator } from 'zustand';

import type { Departments } from '@/db/schema';

export interface DepartmentSlice {
  departments: Departments[];
  setDepartments: (departments: Departments[]) => void;
}
export const createDepartmentSlice: StateCreator<
  DepartmentSlice,
  [],
  []
> = set => ({
  departments: [],
  setDepartments: (departments: Departments[]) => set(() => ({ departments })),
});
