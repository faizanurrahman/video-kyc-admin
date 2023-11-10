type FeedbackServiceType = 'IB_ADD_FEEDBACK' | 'IB_GET_FEEDBACK';

interface NewLogin {
  loginId: string;
  transactionId: string;
}

interface Data {
  FEEDBACK_MSG: string;
  FEEDBACK_CATEGORY: string;
  BRANCH_ID?: string;
  RATING?: string;

  ACTUAL_BRANCH_ID?: any;
}

// interface FeedbackRequest {
//   newLoginBean: NewLogin;
//   serviceName: FeedbackServiceType;
//   requestId: string;
//   sessionId: string;
//   data: Data;
// }

export class FeedbackRequestBean {
  public newLoginBean: NewLogin;
  public serviceName: FeedbackServiceType;
  public requestId: string;
  public sessionId: string;
  public data: Data;

  constructor() {
    this.data = {
      FEEDBACK_CATEGORY: '',
      FEEDBACK_MSG: '',
      RATING: '0',
    };
  }
}
