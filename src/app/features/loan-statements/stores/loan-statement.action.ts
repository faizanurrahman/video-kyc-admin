// // Loan Statement Store Actions
//
// import { createAction, props } from '@ngrx/store';
// import { ActiveLoan } from '../models/active-loans.model';
// import { LoanStatement } from '../models/loan-statements.model';
//
// // const activeLoanActionConfig:
//
// // export const activeLoanActionGroup = createActionGroup({
// //   source: 'Load Active Loans',
// //   events: {
// //     'Load Active Loans': props<any>(),
// //     'Load Active Loans Success': props<{ activeLoans: ActiveLoan[] }>(),
// //     'Load Active Loans Failure': props<any>(),
// //   },
// // });
//
// // export const activeLoanStatementActionGroup = createActionGroup({
// //   source: 'Loan Statement',
// //   events: {
// //     'Load Loan Statement': props<any>(),
// //     'Load Loan Statement Success': props<{ loanStatement: LoanStatement }>(),
// //     'Load Loan Statement Failure': props<any>(),
// //   },
// // });
//
// // export const currentLoanNumberActionGroup = createActionGroup({
// //   source: 'Loan Index',
// //   events: {
// //     getCurrentLoanIndex: props<any>,
// //     setCurrentLoanNumber: props<{ loanNumber: string }>(),
// //   },
// // });
//
// export const loadActiveLoans = createAction('[Dashboard] Load Active Loans');
//
// export const loadActiveLoansSuccess = createAction(
//   '[Dashboard] Load Active Loans Success',
//   props<{ activeLoans: ActiveLoan[] }>()
// );
// export const loadActiveLoansFailure = createAction(
//   '[Dashboard] Load Active Loans Failure'
// );
//
// export const loadLoanStatement = createAction(
//   '[Dashboard] Load Loan Statement',
//   props<{ loanNumber: string }>()
// );
// export const loadLoanStatementSuccess = createAction(
//   '[Dashboard] Load Loan Statement Success',
//   props<{ loanStatement: LoanStatement }>()
// );
// export const loadLoanStatementFailure = createAction(
//   '[Dashboard] Load Loan Statement Failure',
//   props<{ error: string }>()
// );
//
// export const setCurrentLoanNumber = createAction(
//   '[Dashboard] Set Current Loan Number',
//   props<{ loanNumber: string }>()
// );
// export const clearCurrentLoanNumber = createAction(
//   '[Dashboard] Clear Current Loan Number'
// );
//
// export const nextLoanAccountNumber = createAction(
//   '[Dashboard] Load Next Loan Account'
// );
//
// export const prevLoanAccountNumber = createAction(
//   '[Dashboard] Load Previous Loan Details'
// );
//
// import { Action } from '@ngrx/store';
//
// // Load Active Loans Actions
// export enum ActiveLoanActionTypes {
//   LoadActiveLoans = '[Active Loan] Load Active Loans',
//   LoadActiveLoansSuccess = '[Active Loan] Load Active Loans Success',
//   LoadActiveLoansFail = '[Active Loan] Load Active Loans Fail',
// }
//
// export class LoadActiveLoans implements Action {
//   readonly type = ActiveLoanActionTypes.LoadActiveLoans;
// }
//
// export class LoadActiveLoansSuccess implements Action {
//   readonly type = ActiveLoanActionTypes.LoadActiveLoansSuccess;
//
//   constructor(public payload: { activeLoans: ActiveLoan[] }) {}
// }
//
// export class LoadActiveLoansFail implements Action {
//   readonly type = ActiveLoanActionTypes.LoadActiveLoansFail;
//
//   constructor(public payload: { error: string }) {}
// }
//
// // Select Current Loan Action
// export enum CurrentLoanActionTypes {
//   SelectCurrentLoan = '[Current Loan] Select Current Loan',
// }
//
// export class SelectCurrentLoan implements Action {
//   readonly type = CurrentLoanActionTypes.SelectCurrentLoan;
//
//   constructor(
//     public payload: { currentLoanNumber: string; currentLoanIndex: number }
//   ) {}
// }
//
// // Fetch Loan Statement Actions
// export enum LoanStatementActionTypes {
//   FetchLoanStatement = '[Loan Statement] Fetch Loan Statement',
//   FetchLoanStatementSuccess = '[Loan Statement] Fetch Loan Statement Success',
//   FetchLoanStatementFail = '[Loan Statement] Fetch Loan Statement Fail',
// }
//
// export class FetchLoanStatement implements Action {
//   readonly type = LoanStatementActionTypes.FetchLoanStatement;
// }
//
// export class FetchLoanStatementSuccess implements Action {
//   readonly type = LoanStatementActionTypes.FetchLoanStatementSuccess;
//
//   constructor(public payload: { loanStatements: LoanStatement }) {}
// }
//
// export class FetchLoanStatementFail implements Action {
//   readonly type = LoanStatementActionTypes.FetchLoanStatementFail;
//
//   constructor(public payload: { error: string }) {}
// }
//
// // Next Active Loan Action
// export enum NextActiveLoanActionTypes {
//   NextActiveLoan = '[Next Active Loan] Next Active Loan',
// }
//
// export class NextActiveLoan implements Action {
//   readonly type = NextActiveLoanActionTypes.NextActiveLoan;
// }
//
// // Clear Active Loans Action
// export enum ClearActiveLoanActionTypes {
//   ClearActiveLoans = '[Active Loan] Clear Active Loans',
// }
//
// export class ClearActiveLoans implements Action {
//   readonly type = ClearActiveLoanActionTypes.ClearActiveLoans;
// }
//
// export type ActiveLoanActions =
//   | LoadActiveLoans
//   | LoadActiveLoansSuccess
//   | LoadActiveLoansFail
//   | SelectCurrentLoan
//   | FetchLoanStatement
//   | FetchLoanStatementSuccess
//   | FetchLoanStatementFail
//   | NextActiveLoan
//   | ClearActiveLoans;
