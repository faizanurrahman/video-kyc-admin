// import { isDevMode } from '@angular/core';
// import {
//   ActionReducer,
//   ActionReducerMap,
//   createFeatureSelector,
//   createSelector,
//   MetaReducer
// } from '@ngrx/store';
// import { environment } from '../../environments/environment';
// import { activeLoanReducer } from '../features/loan-statements/stores/loan-statement.reducer';
// import { ActiveLoanState } from '../features/loan-statements/stores/loan-statement.state';
// import { localStorageSync } from 'ngrx-store-localstorage';
//
//
// export interface AppState {
//
//   activeLoanState: ActiveLoanState,
//
//
//
// }
//
// export const reducers: ActionReducerMap<AppState> = {
//
//   activeLoanState: activeLoanReducer
//
// };
//
// // Define the meta-reducer that syncs state with local storage
// export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
//   return localStorageSync({ keys: ['activeLoanState'], rehydrate: true })(reducer);
// }
//
//
// export const metaReducers: MetaReducer<AppState>[] = environment.production
//   ? [localStorageSyncReducer]
//   : [];
