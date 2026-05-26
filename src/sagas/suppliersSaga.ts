import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { suppliersActions } from '../slices/suppliersSlice';
import { toastPushed } from '../slices/uiSlice';
import { suppliersApi } from '../api/catalogs';
import { toApiError } from '../api/client';
import type { Catalog, Paginated } from '../types/domain';
import type { RootState } from '../store';

function* fetchListSaga(_action: PayloadAction<{ page?: number; search?: string } | undefined>) {
  try {
    const { page, search } = yield select((s: RootState) => ({
      page: s.suppliers.page,
      search: s.suppliers.search,
    }));
    const res: Paginated<Catalog> = yield call(suppliersApi.list, { page, search });
    yield put(suppliersActions.fetchListSucceeded({ items: res.data, pagination: res.pagination }));
  } catch (e) {
    const err = toApiError(e);
    yield put(suppliersActions.fetchListFailed(err.message));
  }
}

function* refetch() {
  yield put(suppliersActions.fetchListRequested(undefined));
}

function* createSaga(action: PayloadAction<{ code: string; name: string }>) {
  try {
    yield call(suppliersApi.create, action.payload);
    yield put(suppliersActions.mutationSucceeded());
    yield put(toastPushed('success', 'Proveedor creado'));
    yield put(suppliersActions.fetchListRequested(undefined));
  } catch (e) {
    const err = toApiError(e);
    yield put(suppliersActions.mutationFailed(err.message));
    yield put(toastPushed('error', err.message));
  }
}

function* updateSaga(
  action: PayloadAction<{ id: number; body: { code?: string; name?: string } }>,
) {
  try {
    yield call(suppliersApi.update, action.payload.id, action.payload.body);
    yield put(suppliersActions.mutationSucceeded());
    yield put(toastPushed('success', 'Proveedor actualizado'));
    yield put(suppliersActions.fetchListRequested(undefined));
  } catch (e) {
    const err = toApiError(e);
    yield put(suppliersActions.mutationFailed(err.message));
    yield put(toastPushed('error', err.message));
  }
}

function* deleteSaga(action: PayloadAction<number>) {
  try {
    yield call(suppliersApi.remove, action.payload);
    yield put(toastPushed('success', 'Proveedor eliminado'));
    yield put(suppliersActions.fetchListRequested(undefined));
  } catch (e) {
    const err = toApiError(e);
    yield put(toastPushed('error', err.message));
  }
}

export default function* suppliersSaga() {
  yield takeLatest(suppliersActions.fetchListRequested.type, fetchListSaga);
  yield takeLatest(
    [suppliersActions.searchChanged.type, suppliersActions.pageChanged.type],
    refetch,
  );
  yield takeEvery(suppliersActions.createRequested.type, createSaga);
  yield takeEvery(suppliersActions.updateRequested.type, updateSaga);
  yield takeEvery(suppliersActions.deleteRequested.type, deleteSaga);
}
