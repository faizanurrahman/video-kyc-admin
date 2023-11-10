// import { createSelector } from '@ngrx/store';
// import { AppState } from '../../../store';
// import { ActiveLoanState } from './loan-statement.state';
//
// // Select the entire active loan state slice
// export const selectActiveLoanState = (state: AppState) => state.activeLoanState;
//
// // Select the active loans array from the active loan state slice
// // export const selectActiveLoans = createSelector(
// //   selectActiveLoanState,
// //   (state: ActiveLoanState) => { return state.activeLoans }
//
// // );
//
// export const selectActiveLoans = createSelector(
//   selectActiveLoanState,
//   (state) => state.activeLoans
// );
//
// // Select the current loan number from the active loan state slice
// export const selectCurrentLoanNumber = createSelector(
//   selectActiveLoanState,
//   (state: ActiveLoanState) => state.currentLoanNumber
// );
//
// // Select the loan statements object from the active loan state slice
// export const selectLoanStatements = createSelector(
//   selectActiveLoanState,
//   (state: ActiveLoanState) => state.loanStatements
// );
//
// // Select the status string from the active loan state slice
// export const selectActiveLoanStatus = createSelector(
//   selectActiveLoanState,
//   (state: ActiveLoanState) => state.status
// );
//
// // Select the error string from the active loan state slice
// export const selectActiveLoanError = createSelector(
//   selectActiveLoanState,
//   (state: ActiveLoanState) => state.error
// );
