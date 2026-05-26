import { call, put, select, takeLatest } from 'redux-saga/effects';
import { landsSlice, productsSlice } from '../slices/catalogReadSlice';
import { landsApi, productsApi } from '../api/catalogs';
import { toApiError } from '../api/client';
import type { Catalog, Paginated } from '../types/domain';
import type { RootState } from '../store';

function makeFetchSaga(
  slice: typeof landsSlice | typeof productsSlice,
  api: typeof landsApi,
  key: 'lands' | 'products',
) {
  return function* fetch() {
    try {
      const { page, search } = yield select((s: RootState) => ({
        page: s[key].page,
        search: s[key].search,
      }));
      const res: Paginated<Catalog> = yield call(api.list, { page, search, pageSize: 100 });
      yield put(
        slice.actions.fetchListSucceeded({ items: res.data, pagination: res.pagination }),
      );
    } catch (e) {
      yield put(slice.actions.fetchListFailed(toApiError(e).message));
    }
  };
}

export default function* catalogReadSagas() {
  yield takeLatest(
    [landsSlice.actions.fetchListRequested.type, landsSlice.actions.searchChanged.type, landsSlice.actions.pageChanged.type],
    makeFetchSaga(landsSlice, landsApi, 'lands'),
  );
  yield takeLatest(
    [productsSlice.actions.fetchListRequested.type, productsSlice.actions.searchChanged.type, productsSlice.actions.pageChanged.type],
    makeFetchSaga(productsSlice, productsApi, 'products'),
  );
}
