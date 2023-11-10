export class LoanStatementResponseModel {
  status: string;
  statusCode: string;
  statusDesc: string;
  instId: number;
  serviceName: string;
  requestId: string;
  sessionId: string;
  newLoginBean: {
    statusCode: string;
    statusDesc: string;
    loginId: string;
    customerId: string;
    mobileNumber: string;
    transactionId: string;
    instId: number;
    tncStatus: boolean;
  };
  genericServiceBean: {
    channelId: number;
    statusCode: string;
    statusDesc: string;
    serviceId: number;
    customerId: string;
    instId: number;
    endSession: boolean;
    resultSet: {
      className: string;
      response: string;
    };
    doMobeeCustomer: {
      acctPrimary: any;
      alertEmail: any;
      changes: any;
      custId: any;
      custName: any;
      dataSourceList: any;
      doSapBpQueryResponse: any;
      allAccList: any;
      instId: number;
      langId: number;
      mobileNumber: any;
      mvisaId: any;
      picId: any;
      sPackId: any;
      doMobeeCustomerString: any;
      spackId: any;
    };
    sPackId: number;
  };
  decisionPageRequired: boolean;
  data: {
    LOAN_ACCT: string;
    ST_TYPE: string;
    ST_FROM_DATE: string;
    ST_TO_DATE: string;
    arrears?: string;

    STATEMENT_RESP: {
      esZloanOutStHdr: {
        ranl: string;
        loanCurr: string;
        loanAmt: string;
        loanDisb: string;
        loanBal2BDisb: string;
        loanSettle: string;
        loanBalance: string;
        loanAddFund: string;
        loanRemCapBal: string;
        loanBankRef: string;
        pkond: string;
        int2Date: string;
        sstati: string;
        bpNumber: string;
        bpName: string;
        address: string;
      };
      etZloanOutInfSt: any;
      etZloanOutSt: {
        item: {
          ranl: string;
          docDate: string;
          docRef: string;
          docDesc: string;
          docDebit: string;
          docCredit: string;
          docBalance: string;
        }[];
      };
    };
    msg: string;
  };
}
