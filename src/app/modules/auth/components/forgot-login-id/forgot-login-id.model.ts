export interface ValidateUserPayloadModel {
  instId?: '1';
  requestId?: '2901021';
  serviceName: 'IB_FORGOT_LOGIN_ID';
  data: {
    FOR_SERVICE: 'IB_FORGOT_LOGIN_ID';
    RETRIEVAL_TYPE: 'WITH_BP' | 'WITHOUT_BP';
    BP_NUMBER?: string;
    MOBILE_NO?: string;
    DOB?: string;
  };
}

export interface ValidateUserResponseModel {
  status: 'CUSTOMER_DOES_NOT_EXIST' | 'SUCCESS' | any;
  statusCode: string;
  statusDesc: string;
  instId: 1;
  serviceName: 'IB_FORGOT_LOGIN_ID';
  requestId: '2901021';
  sessionId: string;
  decisionPageRequired: false;

  data: {
    FOR_SERVICE: 'IB_FORGOT_LOGIN_ID';
    RETRIEVAL_TYPE: 'WITHOUT_BP' | 'WITH_BP';
    MOBILE_NO?: string;
    DOB?: string;

    BP_NUMBER?: string;
  };
}

export interface ValidateOTPPayloadModel {
  instId: '1';
  requestId: '2901021';
  serviceName: 'IB_FORGOT_LOGIN_ID';
  sessionId: string;
  data: {
    FOR_SERVICE: 'IB_FORGOT_LOGIN_ID';
    ENTERED_OTP: string;
  };
}

export interface ValidateOTPResponseModel {
  status: 'SUCCESS' | any;
  statusCode: string;
  statusDesc: string;
  instId: 1;
  serviceName: 'IB_FORGOT_LOGIN_ID';
  requestId: '2901021';
  sessionId: string;
  decisionPageRequired: false;

  data: {
    FOR_SERVICE: 'IB_FORGOT_LOGIN_ID';
    ENTERED_OTP: string;
  };
}
