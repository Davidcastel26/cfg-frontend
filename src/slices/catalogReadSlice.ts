import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Catalog, Pagination } from '../types/domain';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface CatalogReadState {
  items: Catalog[];
  pagination: Pagination;
  search: string;
  page: number;
  status: Status;
  error: string | null;
}

const initialState: CatalogReadState = {
  items: [],
  pagination: { page: 1, pageSize: 100, total: 0, totalPages: 0 },
  search: '',
  page: 1,
  status: 'idle',
  error: null,
};

export function createCatalogReadSlice(name: 'lands' | 'products') {
  const slice = createSlice({
    name,
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
    },
  });
  return slice;
}

export const landsSlice = createCatalogReadSlice('lands');
export const productsSlice = createCatalogReadSlice('products');
