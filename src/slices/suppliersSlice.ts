import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Catalog, Pagination } from '../types/domain';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface SuppliersState {
  items: Catalog[];
  pagination: Pagination;
  search: string;
  page: number;
  status: Status;
  error: string | null;
  form: {
    mode: 'create' | 'edit' | 'idle';
    draft: Catalog | null;
    saving: boolean;
    error: string | null;
  };
}

const initialState: SuppliersState = {
  items: [],
  pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
  search: '',
  page: 1,
  status: 'idle',
  error: null,
  form: { mode: 'idle', draft: null, saving: false, error: null },
};

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    fetchListRequested(state, _action: PayloadAction<{ page?: number; search?: string } | undefined>) {
      state.status = 'loading';
      state.error = null;
    },
    fetchListSucceeded(
      state,
      action: PayloadAction<{ items: Catalog[]; pagination: Pagination }>,
    ) {
      state.status = 'succeeded';
      state.items = action.payload.items;
      state.pagination = action.payload.pagination;
    },
    fetchListFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    searchChanged(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    pageChanged(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    formOpened(state, action: PayloadAction<{ mode: 'create' | 'edit'; draft: Catalog | null }>) {
      state.form.mode = action.payload.mode;
      state.form.draft = action.payload.draft;
      state.form.error = null;
    },
    formClosed(state) {
      state.form = { mode: 'idle', draft: null, saving: false, error: null };
    },
    createRequested(state, _action: PayloadAction<{ code: string; name: string }>) {
      state.form.saving = true;
      state.form.error = null;
    },
    updateRequested(
      state,
      _action: PayloadAction<{ id: number; body: { code?: string; name?: string } }>,
    ) {
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

export const suppliersActions = suppliersSlice.actions;
export default suppliersSlice.reducer;
