export interface CaptchaModelRequest {
  instId: string;
  requestId: string;
  serviceName: 'GET_CHALLENGE';
  data: {
    CAPTCHA_WIDTH: string;
    CAPTCHA_HEIGHT: string;
  };
}

export interface CaptchaModelResponse {
  instId: string;
  requestId: string;
  sessionId: string;
  decisionPageRequired: boolean;
  data: {
    CAPTCHA_WIDTH: string;
    CAPTCHA_HEIGHT: string;
    CAPTCHA_IMG_DATA: string;
  };
}

export class CaptchaModel {
  private CAPTCHA_WIDTH: string;
  private CAPTCHA_HEIGHT: string;
  private CAPTCHA_IMG_DATA: string;

  constructor() {
    this.CAPTCHA_IMG_DATA = '';
  }

  get captchaImage() {
    return this.CAPTCHA_IMG_DATA;
  }

  set captchaImage(value: string) {
    this.CAPTCHA_IMG_DATA = '';
    if (value.includes('data:image/png;base64,')) {
      this.CAPTCHA_IMG_DATA = value;
    } else {
      this.CAPTCHA_IMG_DATA = 'data:image/png;base64,' + value;
    }

    // // console.log('captcha image', this.CAPTCHA_IMG_DATA);
  }

  get height() {
    return this.CAPTCHA_HEIGHT;
  }

  set height(value: string) {
    this.CAPTCHA_HEIGHT = value;
  }

  get width() {
    return this.CAPTCHA_WIDTH;
  }

  set width(value: string) {
    this.CAPTCHA_WIDTH = value;
  }
}

// export type CaptchaResponseModel = GenericResponseModel<CaptchaModel>;

export interface CaptchaRequestData {
  TYPE: 'WITH_BP' | 'WITHOUT_BP';
  BP_NUMBER?: string;
  FIRST_NAME?: string;
  LAST_NAME?: string;
  GENDER?: 'M' | 'F';
  DOB?: string;

  MOBILE_NO: string;

  IB_USERNAME: string;
  ID_NUMBER: string;
  CAPTCHA_USER_ANSWER: string;
}

export interface CaptchaRequestPayload {
  instId: string;
  requestId: string;
  serviceName: 'IB_CUST_SELF_OPTIN';
  sessionId: string;
  data: CaptchaRequestData;
}

export interface CaptchaResponseData {
  MOBILE_NO: string;
  BP_NUMBER?: string;
  TYPE: string;
  IB_USERNAME: string;
  CAPTCHA_USER_ANSWER: string;
  CUST_NAME: string;
}

export interface CaptchaResponsePayload {
  status: string;
  statusCode: string;
  statusDesc: string;
  instId: number;
  serviceName: string;
  requestId: string;
  sessionId: string;
  decisionPageRequired: boolean;
  data: CaptchaResponseData;
}
