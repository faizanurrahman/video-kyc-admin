interface NewLoginBean {
  loginId: string;
  transactionId: string;
}

interface Data {
  CARD_WAMOUNT: string;
  LOAN_ACCT: string;
}

// interface Request {
//   newLoginBean: NewLoginBean;
//   serviceName: string;
//   requestId: string;
//   sessionId: string;
//   data: Data;
// }

export interface LoanPaymentRequestPayload {
  newLoginBean: NewLoginBean;
  serviceName: string;
  requestId: string;
  sessionId: string;
  data: Data;
}
