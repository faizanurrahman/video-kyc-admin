interface NewLoginBean {
  statusCode: string;
  statusDesc: string;
  loginId: string;
  customerId: string;
  mobileNumber: string;
  transactionId: string;
  instId: number;
  tncStatus: boolean;
}

interface DoMobeeCustomer {
  acctPrimary: any;
  alertEmail: any;
  charges: any;
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
  doMobeeCustomerString: string;
  spackId: any;
}

interface GenericServiceBean {
  channelId: number;
  serviceId: number;
  customerId: string;
  instId: number;
  endSession: boolean;
  doMobeeCustomer: DoMobeeCustomer;
  sPackId: number;
}

interface Data {
  CARD_WAMOUNT: string;
  LOAN_ACCT: string;
  PAY_REQUEST_ID: string;
  CHECKSUM: string;
  confirmationMessage: any;
}

export interface LoanPaymentResponsePayload {
  status: string;
  statusCode: string;
  statusDesc: string;
  instId: number;
  serviceName: string;
  requestId: string;
  sessionId: string;
  newLoginBean: NewLoginBean;
  genericServiceBean: GenericServiceBean;
  decisionPageRequired: boolean;
  data: Data;
}
