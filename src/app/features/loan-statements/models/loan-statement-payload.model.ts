export class LoanStatementPayloadModel {
  newLoginBean: {
    loginId: string;
    transactionId: string;
  };
  serviceName: string;
  requestId: string;
  sessionId: string;
  data: {
    LOAN_ACCT: string;
    ST_TYPE: string;
    ST_FROM_DATE: string;
    ST_TO_DATE: string;
  };

  constructor(accountNumber: string, statementType: 'MS' | 'FS', from: string, to: string) {
    this.data = {
      LOAN_ACCT: '',
      ST_TYPE: 'MS',
      ST_FROM_DATE: '',
      ST_TO_DATE: '',
    };

    this.data.LOAN_ACCT = accountNumber;
    this.data.ST_TYPE = statementType;
    this.data.ST_FROM_DATE = from;
    this.data.ST_TO_DATE = to;

    this.newLoginBean = {
      loginId: '',
      transactionId: '',
    };

    this.newLoginBean.transactionId = '24012023080821984256712345993';
    this.serviceName = 'IB_STATEMENT';
    this.requestId = '25671234599324012023080821984';
  }
}
