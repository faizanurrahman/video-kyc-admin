// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { catchError, map, mergeMap } from 'rxjs';
// import { ActiveLoanService } from '../services/active-loan.service';
// import { LoanStatementService } from '../services/loan-statement.service';
// import {
//   loadActiveLoans,
//   loadActiveLoansFailure,
//   loadActiveLoansSuccess,
//   loadLoanStatement,
//   loadLoanStatementFailure,
//   loadLoanStatementSuccess,
// } from './loan-statement.action';
//
// @Injectable()
// export class ActiveLoanEffects {
//   loadActiveLoans$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(loadActiveLoans),
//       mergeMap(() => {
//         return this.activeLoanService.getActiveLoans().pipe(
//           map((activeLoans) => loadActiveLoansSuccess({ activeLoans })),
//           catchError(async (error) => loadActiveLoansFailure())
//         );
//       })
//     );
//   });
//
//   loadLoanStatement$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(loadLoanStatement),
//       mergeMap((action) => {
//         return this.loanStatementService
//           .getLoanStatementByLoanNumber(action.loanNumber)
//           .pipe(
//             map((loanStatement) => loadLoanStatementSuccess({ loanStatement })),
//             catchError(async (error) => loadLoanStatementFailure({ error }))
//           );
//       })
//     );
//   });
//
//   constructor(
//     private actions$: Actions,
//     private activeLoanService: ActiveLoanService,
//     private loanStatementService: LoanStatementService
//   ) {}
// }
