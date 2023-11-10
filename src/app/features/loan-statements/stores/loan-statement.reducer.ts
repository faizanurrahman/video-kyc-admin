// import { createReducer, on } from '@ngrx/store';
// import {
//   clearCurrentLoanNumber,
//   loadActiveLoans,
//   loadActiveLoansFailure,
//   loadActiveLoansSuccess,
//   loadLoanStatement,
//   loadLoanStatementFailure,
//   loadLoanStatementSuccess,
//   nextLoanAccountNumber,
//   prevLoanAccountNumber,
//   setCurrentLoanNumber,
// } from './loan-statement.action';
// import {
//   ActiveLoanState,
//   initialActiveLoanState,
// } from './loan-statement.state';
//
// export const activeLoanReducer = createReducer(
//   initialActiveLoanState,
//
//   // On Loading Active Loans Set Status to Loading
//   on(
//     loadActiveLoans,
//     (state): ActiveLoanState => ({ ...state, status: 'loading' })
//   ),
//   // On Loading Active Loans Success Set Status to Success
//   on(
//     loadActiveLoansSuccess,
//     (state, action): ActiveLoanState => ({
//       ...state,
//       status: 'success',
//       activeLoans: action.activeLoans,
//       error: null,
//       currentLoanIndex: 0,
//       currentLoanNumber: action.activeLoans[0].accountNo,
//     })
//   ),
//   // On Loading Active Loans Failure Set Status to Error
//   on(
//     loadActiveLoansFailure,
//     (state): ActiveLoanState => ({ ...state, status: 'error' })
//   ),
//
//   // On Loading Loan Statement Set Status to Loading
//   on(loadLoanStatement, (state, action): ActiveLoanState => {
//     return {
//       ...state,
//       status: 'loading',
//       currentLoanNumber: action.loanNumber,
//       // currentLoanIndex
//
//       loanStatements: null, // clear loan statement
//     }; // todo: fix this
//   }),
//
//   // On Loading Loan Statement Success Set Status to Success
//   on(loadLoanStatementSuccess, (state, action): ActiveLoanState => {
//     // // console.log('loadLoanStatementSuccess old state and action', state, action);
//     return {
//       ...state,
//       status: 'success',
//       loanStatements: action.loanStatement,
//       error: null,
//     };
//   }),
//
//   // On Loading Loan Statement Failure Set Status to Error
//   on(
//     loadLoanStatementFailure,
//     (state): ActiveLoanState => ({ ...state, status: 'error' })
//   ),
//
//   // On Setting Current Loan Number Set Current Loan Number
//   on(
//     setCurrentLoanNumber,
//     (state, action): ActiveLoanState => ({
//       ...state,
//       currentLoanNumber: action.loanNumber,
//     })
//   ),
//   // On Clearing Current Loan Number Clear Current Loan Number
//   on(
//     clearCurrentLoanNumber,
//     (state): ActiveLoanState => ({ ...state, currentLoanNumber: '' })
//   ),
//
//   // next card
//
//   on(nextLoanAccountNumber, (state) => ({
//     ...state,
//     currentLoanIndex: state.currentLoanIndex + (1 % state.activeLoans.length),
//   })),
//
//   on(prevLoanAccountNumber, (state) => ({
//     ...state,
//     currentLoanIndex:
//       (state.currentLoanIndex - 1 + state.activeLoans.length) %
//       state.activeLoans.length,
//   }))
// );
