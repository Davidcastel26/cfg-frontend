import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import ticketsReducer from './slices/ticketsSlice';
import suppliersReducer from './slices/suppliersSlice';
import { landsSlice, productsSlice } from './slices/catalogReadSlice';
import paymentsReducer from './slices/paymentsSlice';
import importReducer from './slices/importSlice';
import uiReducer from './slices/uiSlice';
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
    suppliers: suppliersReducer,
    lands: landsSlice.reducer,
    products: productsSlice.reducer,
    payments: paymentsReducer,
    import: importReducer,
    ui: uiReducer,
  },
  middleware: (gDM) => gDM({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
