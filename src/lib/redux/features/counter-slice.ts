import type { PayloadAction } from '@reduxjs/toolkit';

import { createAppSlice } from '@/lib/redux/create-app-slice';

export type CounterSliceState = {
  value: number;
  status: 'idle' | 'loading' | 'failed';
};

const initialState: CounterSliceState = {
  value: 0,
  status: 'idle',
};

export const counterSlice = createAppSlice({
  name: 'counter',
  initialState,
  reducers: create => ({
    increment: create.reducer(state => {
      state.value += 1;
    }),
    decrement: create.reducer(state => {
      state.value -= 1;
    }),
    incrementByAmount: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.value += action.payload;
      },
    ),
  }),
  selectors: {
    selectCount: counter => counter.value,
    selectStatus: counter => counter.status,
  },
});

export const { decrement, increment, incrementByAmount } = counterSlice.actions;
export const { selectCount, selectStatus } = counterSlice.selectors;
