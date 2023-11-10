import { ActiveLoan } from '../models/active-loans.model';
import { LoanStatement } from '../models/loan-statements.model';

export interface ActiveLoanState {
  activeLoans: ActiveLoan[];
  currentLoanNumber: string;
  currentLoanIndex: number;
  loanStatements: LoanStatement | null;
  status: 'pending' | 'loading' | 'success' | 'error';
  error: string | null;
}

export const initialActiveLoanState: ActiveLoanState = {
  activeLoans: [],
  currentLoanNumber: '',
  currentLoanIndex: 0,
  loanStatements: null,
  status: 'pending',
  error: null,
};
