// {
//   "serviceName": "IB_CUST_SELF_OPTIN",
//   "requestId": "25671234599324012023080821984",
//   "sessionId": "6f511372-e989-4d32-a4cf-efffaf10ee95",
//   "data": {
//     "MOBILE_NO": "2676865656",
//     "BP_NUMBER": "2000041046",
//     "TYPE": "WITH_BP",
//     "IB_USERNAME": "testreg",
//     "OTP": "1111",
//     "IB_PASSWORD" : "1234",
//     "IB_CONFIRM_PASSWORD" : "1234"
//   }
// }

export interface RegisterRequestData {
  MOBILE_NO: string;
  BP_NUMBER: string;
  ID_NUMBER: string;
  TYPE: 'WITH_BP' | 'WITHOUT_BP';
  IB_USERNAME: string;
  OTP: string;
  IB_PASSWORD: string;
  IB_CONFIRM_PASSWORD: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  GENDER: 'M' | 'F';
  DOB: string;
}

export interface RegisterRequestPayload {
  serviceName: 'IB_CUST_SELF_OPTIN';
  requestId: string;
  sessionId: string;
  data: RegisterRequestData;
}

export interface RegisterResponseData {
  MOBILE_NO: string;
  BP_NUMBER: string;
  TYPE: 'WITH_BP' | 'WITHOUT_BP';
  IB_USERNAME: string;
  OTP: string;
  IB_PASSWORD: string;
  IB_CONFIRM_PASSWORD: string;
  msg: string;
}

// NewLoginBean interface
interface NewLoginBean {
  tncStatus: boolean;
}

// DoMobeeCustomer interface
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

// ResultSet interface
interface ResultSet {
  className: string;
  response: string;
}

// GenericServiceBean interface
interface GenericServiceBean {
  channelId: number;
  referenceId: string;
  statusCode: string;
  statusDesc: string;
  serviceId: number;
  instId: number;
  endSession: boolean;
  resultSet: ResultSet;
  doMobeeCustomer: DoMobeeCustomer;
  newLoginBean: NewLoginBean;
}

// Data interface
// interface Data {
//   MOBILE_NO: string;
//   BP_NUMBER: string;
//   TYPE: string;
//   IB_USERNAME: string;
//   OTP: string;
//   IB_PASSWORD: string;
//   IB_CONFIRM_PASSWORD: string;
//   msg: string;
// }

// Response interface
export interface RegisterResponsePayload {
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
  data: RegisterResponseData;
}

// {
//     "status": "SUCCESS",
//     "statusCode": "000",
//     "statusDesc": "Customer Successfully Registered",
//     "instId": 1,
//     "serviceName": "IB_CUST_SELF_OPTIN",
//     "requestId": "25671234599324012023080821984",
//     "sessionId": "6f511372-e989-4d32-a4cf-efffaf10ee95",
//     "newLoginBean": {
//         "tncStatus": false
//     },
//     "genericServiceBean": {
//         "channelId": 2001,
//         "referenceId": "25671234599324012023080821984",
//         "statusCode": "SUCCESS",
//         "statusDesc": "Transaction Successful",
//         "serviceId": 9100,
//         "instId": 1,
//         "endSession": false,
//         "resultSet": {
//             "className": "StringTypeResultSet",
//             "response": "Customer Successfully Registered"
//         },
//         "doMobeeCustomer": {
//             "acctPrimary": null,
//             "alertEmail": null,
//             "charges": null,
//             "custId": null,
//             "custName": null,
//             "dataSourceList": null,
//             "doSapBpQueryResponse": null,
//             "allAccList": null,
//             "instId": 1,
//             "langId": 1,
//             "mobileNumber": null,
//             "mvisaId": null,
//             "picId": null,
//             "sPackId": null,
//             "spackId": null,
//             "doMobeeCustomerString": "null|1|null|null|\n"
//         },
//         "newLoginBean": {
//             "tncStatus": false
//         }
//     },
//     "decisionPageRequired": false,
//     "data": {
//         "MOBILE_NO": "2676865656",
//         "BP_NUMBER": "2000041046",
//         "TYPE": "WITH_BP",
//         "IB_USERNAME": "testreg",
//         "OTP": "1111",
//         "IB_PASSWORD": "1234",
//         "IB_CONFIRM_PASSWORD": "1234",
//         "msg": "Customer Successfully Registered"
//     }
// }
