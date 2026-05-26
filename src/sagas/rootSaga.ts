import { all, fork } from 'redux-saga/effects';
import ticketsSaga from './ticketsSaga';
import suppliersSaga from './suppliersSaga';
import catalogReadSagas from './catalogReadSagas';
import paymentsSaga from './paymentsSaga';
import importSaga from './importSaga';

export default function* rootSaga() {
  yield all([fork(ticketsSaga), fork(suppliersSaga), fork(catalogReadSagas), fork(paymentsSaga), fork(importSaga)]);
}
