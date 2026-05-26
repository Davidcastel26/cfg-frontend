import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { paymentsActions } from '../slices/paymentsSlice';
import { paymentsApi } from '../api/payments';
import { toApiError } from '../api/client';
import type { WeekEntry, WeeklySummary } from '../types/domain';

function* weeksSaga() {
  try {
    const data: WeekEntry[] = yield call(paymentsApi.weeks);
    yield put(paymentsActions.weeksSucceeded(data));
  } catch (e) {
    yield put(paymentsActions.weeksFailed(toApiError(e).message));
  }
}

function* weekSelectedSaga(action: PayloadAction<{ isoYear: number; isoWeek: number }>) {
  try {
    const summary: WeeklySummary = yield call(
      paymentsApi.weekly,
      action.payload.isoYear,
      action.payload.isoWeek,
    );
    yield put(paymentsActions.summarySucceeded(summary));
  } catch (e) {
    yield put(paymentsActions.summaryFailed(toApiError(e).message));
  }
}

export default function* paymentsSaga() {
  yield takeLatest(paymentsActions.weeksRequested.type, weeksSaga);
  yield takeLatest(paymentsActions.weekSelected.type, weekSelectedSaga);
}
