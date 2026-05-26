import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WeekEntry, WeeklySummary } from '../types/domain';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface PaymentsState {
  selectedWeek: { isoYear: number; isoWeek: number } | null;
  weeks: WeekEntry[];
  weeksStatus: Status;
  summary: WeeklySummary | null;
  summaryStatus: Status;
  expandedSuppliers: Record<number, boolean>;
  error: string | null;
}

const initialState: PaymentsState = {
  selectedWeek: null,
  weeks: [],
  weeksStatus: 'idle',
  summary: null,
  summaryStatus: 'idle',
  expandedSuppliers: {},
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    weeksRequested(state) {
      state.weeksStatus = 'loading';
    },
    weeksSucceeded(state, action: PayloadAction<WeekEntry[]>) {
      state.weeksStatus = 'succeeded';
      state.weeks = action.payload;
    },
    weeksFailed(state, action: PayloadAction<string>) {
      state.weeksStatus = 'failed';
      state.error = action.payload;
    },
    weekSelected(state, action: PayloadAction<{ isoYear: number; isoWeek: number }>) {
      state.selectedWeek = action.payload;
      state.summaryStatus = 'loading';
      state.summary = null;
      state.expandedSuppliers = {};
    },
    summarySucceeded(state, action: PayloadAction<WeeklySummary>) {
      state.summaryStatus = 'succeeded';
      state.summary = action.payload;
    },
    summaryFailed(state, action: PayloadAction<string>) {
      state.summaryStatus = 'failed';
      state.error = action.payload;
    },
    supplierToggled(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.expandedSuppliers[id] = !state.expandedSuppliers[id];
    },
  },
});

export const paymentsActions = paymentsSlice.actions;
export default paymentsSlice.reducer;
