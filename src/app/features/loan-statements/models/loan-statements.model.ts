export interface LoanStatement {
  LOAN_ACCT: string;
  ST_TYPE: string;
  ST_FROM_DATE: string;
  ST_TO_DATE: string;
  arrears?: string;
  STATEMENT_RESP?: StatementResp;
  msg: string;
}

export interface StatementResp {
  esZloanOutStHdr?: EsZloanOutStHdr;
  etZloanOutInfSt?: EtZloanOutSt;
  etZloanOutSt?: EtZloanOutSt;
}

export interface EsZloanOutStHdr {
  ranl?: string;
  loanCurr?: string;
  loanAmt?: string;
  loanDisb?: string;
  loanBal2BDisb?: string;
  loanSettle?: string;
  loanBalance?: string;
  loanAddFund?: string;
  loanRemCapBal?: string;
  loanBankRef?: string;
  pkond?: string;
  int2Date?: string;
  sstati?: string;
  bpNumber?: string;
  bpName?: string;
  address?: string;

  installment?: string;
}

export interface EtZloanOutSt {
  item: EtZloanOutStItem[];
}

export interface EtZloanOutStItem {
  ranl: string;
  docDate: string;
  docRef: string;
  docDesc: string;
  docDebit: string;
  docCredit: string;
  docBalance: string;
}

// /* --------------------------------- // test -------------------------------- */
// /* --------------------------------- testy; --------------------------------- */
// // test
