// API : pfsvc/resetPwdCheckUser
export interface ResetPasswordCheckUserRequestPayload {
  instId: '1';
  requestId: '2901021';
  serviceName: 'IB_RESET_PASSWORD';
  data: {
    FOR_SERVICE: 'IB_RESET_PASSWORD';
    IB_USERNAME: string;
  };
}

export interface ResetPasswordCheckUserResponsePayload {
  status: 'SUCCESS' | 'INVALID_INPUT_DETAILS' | 'FAILURE' | string;
  statusCode: string;
  statusDesc: string;
  instId: number;
  serviceName: 'IB_RESET_PASSWORD';
  requestId: string;
  sessionId: string;
  decisionPageRequired: boolean;
  data: {
    FOR_SERVICE: 'IB_RESET_PASSWORD';
    IB_USERNAME: string;
  };
}

// API : pfsvc/resetPwdValOtp
export interface ResetPasswordValidateOtpRequestPayload {
  instId: '1';
  requestId: '2901021';
  serviceName: 'IB_RESET_PASSWORD';
  sessionId: string;
  data: {
    FOR_SERVICE: 'IB_RESET_PASSWORD';
    IB_USERNAME: string;
    ENTERED_OTP: string;
  };
}

export interface ResetPasswordValidateOtpResponsePayload {
  status: 'SUCCESS' | 'INVALID_INPUT_DETAILS' | 'FAILURE' | string;
  statusCode: string;
  statusDesc: string;
  instId: 1;
  serviceName: 'IB_RESET_PASSWORD';
  requestId: '2901021';
  sessionId: string;
  newLoginBean: any;
  genericServiceBean: any;
  decisionPageRequired: false;
  data: {
    FOR_SERVICE: 'IB_RESET_PASSWORD';
    IB_USERNAME: string;
    ENTERED_OTP: string;
    OTP_RESULT?: boolean;
    confirmationMessage?: any;
  };
}

// API : pfsvc/resetPwd
export interface ResetPasswordRequestPayload {
  instId: '1';
  requestId: '2901021';
  serviceName: 'IB_RESET_PASSWORD';
  sessionId: string;
  data: {
    FOR_SERVICE: 'IB_RESET_PASSWORD';
    IB_USERNAME: string;
    CPIN_NEWPIN: string;
    CPIN_RENEWPIN: string;
  };
}

export interface ResetPasswordResponsePayload {
  status: 'SUCCESS';
  statusCode: '000';
  statusDesc: 'Dear customer, you have successfully changed your password.';
  instId: 1;
  serviceName: 'IB_RESET_PASSWORD';
  requestId: '2901021';
  sessionId: '8fb5f2b0-a380-4693-8a43-0c224477c3fb';
  newLoginBean: {
    tncStatus: false;
  };
  genericServiceBean: {
    channelId: number;
    referenceId: string;
    statusCode: 'SUCCESS' | 'INVALID_INPUT_DETAILS' | 'FAILURE' | string;
    statusDesc: string;
    serviceId: number;
    instId: number;
    endSession: false;
    resultSet: {
      className: string;
      response: string;
    };
    doMobeeCustomer: any;
    newLoginBean: any;
  };
  decisionPageRequired: false;
  data: {
    FOR_SERVICE: 'IB_RESET_PASSWORD';
    IB_USERNAME: string;
    CPIN_NEWPIN: string;
    CPIN_RENEWPIN: string;
    msg: string;
  };
}
