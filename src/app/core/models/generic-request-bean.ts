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

interface ResultSet {
  className: string;
  response: string;
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
  spackId: any;
  doMobeeCustomerString: string;
}

interface GenericServiceBean {
  channelId: number;
  statusCode: string;
  statusDesc: string;
  serviceId: number;
  customerId: string;
  instId: number;
  endSession: boolean;
  resultSet: ResultSet;
  doMobeeCustomer: DoMobeeCustomer;
  sPackId: number;
}

interface Data {
  FEEDBACK_MSG: string;
  FEEDBACK_CATEGORY: string;
  FEEDBACK_ID: number;
  FEEDBACK_CONV_ID: number;
  msg: string;
}

export interface GenericRequestBean {
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
