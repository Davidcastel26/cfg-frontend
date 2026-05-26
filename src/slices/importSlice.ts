import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ImportResult } from '../types/domain';

type Status = 'idle' | 'uploading' | 'success' | 'error';

interface ImportState {
  status: Status;
  progress: number;
  result: ImportResult | null;
  error: string | null;
}

const initialState: ImportState = {
  status: 'idle',
  progress: 0,
  result: null,
  error: null,
};

const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    uploadRequested(state, _action: PayloadAction<File>) {
      state.status = 'uploading';
      state.progress = 0;
      state.result = null;
      state.error = null;
    },
    progressUpdated(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    uploadSucceeded(state, action: PayloadAction<ImportResult>) {
      state.status = 'success';
      state.progress = 100;
      state.result = action.payload;
    },
    uploadFailed(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const importActions = importSlice.actions;
export default importSlice.reducer;
