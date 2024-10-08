import { createAppSlice } from '@/lib/redux/create-app-slice';

export type SidebarSliceState = {
  isOpen: boolean;
};

const initialState: SidebarSliceState = {
  isOpen: false,
};

export const sidebarSlice = createAppSlice({
  name: 'sidebar',
  initialState,
  reducers: create => ({
    setToggle: create.reducer(state => {
      state.isOpen = !state.isOpen;
    }),
  }),
  selectors: {
    selectStatus: (sidebar: SidebarSliceState) => sidebar.isOpen,
  },
});

export const { setToggle } = sidebarSlice.actions;
export const { selectStatus } = sidebarSlice.selectors;
