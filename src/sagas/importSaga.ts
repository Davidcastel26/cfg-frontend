import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { importActions } from '../slices/importSlice';
import { ticketsActions } from '../slices/ticketsSlice';
import { toastPushed } from '../slices/uiSlice';
import { importApi } from '../api/import';
import { toApiError } from '../api/client';
import type { ImportResult } from '../types/domain';

function* uploadSaga(action: PayloadAction<File>) {
  try {
    const result: ImportResult = yield call(importApi.uploadExcel, action.payload);
    yield put(importActions.uploadSucceeded(result));
    yield put(
      toastPushed(
        'success',
        `Importado: ${result.created} creados · ${result.updated} actualizados · ${result.skipped} omitidos`,
      ),
    );
    yield put(ticketsActions.fetchListRequested(undefined));
  } catch (e) {
    const err = toApiError(e);
    yield put(importActions.uploadFailed(err.message));
    yield put(toastPushed('error', err.message));
  }
}

export default function* importSaga() {
  yield takeLatest(importActions.uploadRequested.type, uploadSaga);
}
