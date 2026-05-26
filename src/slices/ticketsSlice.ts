import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pagination, Ticket, TicketFilters, TicketInput } from '../types/domain';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface TicketsState {
  items: Ticket[];
  pagination: Pagination;
  filters: TicketFilters;
  status: Status;
  error: string | null;
  selected: Ticket | null;
  selectedStatus: Status;
  form: {
    mode: 'create' | 'edit' | 'idle';
    draft: Ticket | null;
    saving: boolean;
    error: string | null;
  };
}

const initialState: TicketsState = {
  items: [],
  pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
  filters: { page: 1, pageSize: 20 },
  status: 'idle',
  error: null,
  selected: null,
  selectedStatus: 'idle',
  form: { mode: 'idle', draft: null, saving: false, error: null },
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    fetchListRequested(state, _action: PayloadAction<TicketFilters | undefined>) {
      state.status = 'loading';
      state.error = null;
    },
    fetchListSucceeded(
      state,
      action: PayloadAction<{ items: Ticket[]; pagination: Pagination }>,
    ) {
      state.status = 'succeeded';
      state.items = action.payload.items;
      state.pagination = action.payload.pagination;
    },
    fetchListFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },

    filtersChanged(state, action: PayloadAction<Partial<TicketFilters>>) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    pageChanged(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    pageSizeChanged(state, action: PayloadAction<number>) {
      state.filters.pageSize = action.payload;
      state.filters.page = 1;
    },

    fetchByIdRequested(state, _action: PayloadAction<number>) {
      state.selectedStatus = 'loading';
      state.selected = null;
    },
    fetchByIdSucceeded(state, action: PayloadAction<Ticket>) {
      state.selectedStatus = 'succeeded';
      state.selected = action.payload;
    },
    fetchByIdFailed(state, action: PayloadAction<string>) {
      state.selectedStatus = 'failed';
      state.error = action.payload;
    },

    formOpened(state, action: PayloadAction<{ mode: 'create' | 'edit'; draft: Ticket | null }>) {
      state.form.mode = action.payload.mode;
      state.form.draft = action.payload.draft;
      state.form.error = null;
    },
    formClosed(state) {
      state.form = { mode: 'idle', draft: null, saving: false, error: null };
    },

    createRequested(state, _action: PayloadAction<TicketInput>) {
      state.form.saving = true;
      state.form.error = null;
    },
    updateRequested(state, _action: PayloadAction<{ id: number; input: TicketInput }>) {
      state.form.saving = true;
      state.form.error = null;
    },
    mutationSucceeded(state) {
      state.form = { mode: 'idle', draft: null, saving: false, error: null };
    },
    mutationFailed(state, action: PayloadAction<string>) {
      state.form.saving = false;
      state.form.error = action.payload;
    },

    deleteRequested(_state, _action: PayloadAction<number>) {},
  },
});

export const ticketsActions = ticketsSlice.actions;
export default ticketsSlice.reducer;
export type { TicketsState };
