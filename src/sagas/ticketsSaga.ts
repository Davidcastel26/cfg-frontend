import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { ticketsActions } from '../slices/ticketsSlice';
import { toastPushed } from '../slices/uiSlice';
import { ticketsApi } from '../api/tickets';
import { toApiError } from '../api/client';
import type { Paginated, Ticket, TicketFilters, TicketInput } from '../types/domain';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

function* fetchListSaga(action: PayloadAction<TicketFilters | undefined>) {
  try {
    const stateFilters: TicketFilters = yield select((s: RootState) => s.tickets.filters);
    const filters = action.payload ?? stateFilters;
    const res: Paginated<Ticket> = yield call(ticketsApi.list, filters);
    yield put(ticketsActions.fetchListSucceeded({ items: res.data, pagination: res.pagination }));
  } catch (e) {
    const err = toApiError(e);
    yield put(ticketsActions.fetchListFailed(err.message));
    yield put(toastPushed('error', `Tickets: ${err.message}`));
  }
}

function* refetchAfterChange() {
  yield put(ticketsActions.fetchListRequested(undefined));
}

function* fetchByIdSaga(action: PayloadAction<number>) {
  try {
    const ticket: Ticket = yield call(ticketsApi.getById, action.payload);
    yield put(ticketsActions.fetchByIdSucceeded(ticket));
  } catch (e) {
    const err = toApiError(e);
    yield put(ticketsActions.fetchByIdFailed(err.message));
  }
}

function* createSaga(action: PayloadAction<TicketInput>) {
  try {
    yield call(ticketsApi.create, action.payload);
    yield put(ticketsActions.mutationSucceeded());
    yield put(toastPushed('success', 'Ticket creado'));
    yield put(ticketsActions.fetchListRequested(undefined));
  } catch (e) {
    const err = toApiError(e);
    yield put(ticketsActions.mutationFailed(err.message));
    yield put(toastPushed('error', err.message));
  }
}

function* updateSaga(action: PayloadAction<{ id: number; input: TicketInput }>) {
  try {
    yield call(ticketsApi.replace, action.payload.id, action.payload.input);
    yield put(ticketsActions.mutationSucceeded());
    yield put(toastPushed('success', 'Ticket actualizado'));
    yield put(ticketsActions.fetchListRequested(undefined));
  } catch (e) {
    const err = toApiError(e);
    yield put(ticketsActions.mutationFailed(err.message));
    yield put(toastPushed('error', err.message));
  }
}

function* deleteSaga(action: PayloadAction<number>) {
  try {
    yield call(ticketsApi.remove, action.payload);
    yield put(toastPushed('success', 'Ticket eliminado'));
    yield put(ticketsActions.fetchListRequested(undefined));
  } catch (e) {
    const err = toApiError(e);
    yield put(toastPushed('error', err.message));
  }
}

export default function* ticketsSaga() {
  yield takeLatest(ticketsActions.fetchListRequested.type, fetchListSaga);
  yield takeLatest(
    [
      ticketsActions.filtersChanged.type,
      ticketsActions.pageChanged.type,
      ticketsActions.pageSizeChanged.type,
    ],
    refetchAfterChange,
  );
  yield takeLatest(ticketsActions.fetchByIdRequested.type, fetchByIdSaga);
  yield takeEvery(ticketsActions.createRequested.type, createSaga);
  yield takeEvery(ticketsActions.updateRequested.type, updateSaga);
  yield takeEvery(ticketsActions.deleteRequested.type, deleteSaga);
}
