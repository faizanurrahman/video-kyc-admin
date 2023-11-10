export class IbUserModel {
  status: string;
  statusCode: string;
  statusDesc: string;
  instId: number;
  requestId: string;
  sessionId: string;
  genericServiceBean: {
    endSession: boolean;
    newLoginBean: {
      channelId: number;
      requestedTime: string;
      statusCode: string;
      statusDesc: string;
      loginId: string;
      doMobeeCustomer: {
        acctPrimary: string;
        alertEmail: any;
        charges: any;
        custId: string;
        custName: string;
        dataSourceList: {
          CREDITCARDS: {
            id: string;
            displayName: string;
          }[];
          LOADCARDS: any[];
          ALLCARDS: {
            id: string;
            displayName: string;
          }[];
          LOANAPPS: {
            id: string;
            displayName: string;
          }[];
          LOANAPPSTATUS: {
            id: string;
            displayName: string;
          }[];
          LOANACTS: {
            id: string;
            displayName: string;
          }[];
        };
        doSapBpQueryResponse: any;
        allAccList: {
          accountNo: string;
          balance: string;
          loanAmount: string;
          arrears: string;
          status: string;
        }[];
        instId: number;
        loginId: number;
        mobileNumber: string;
        mvisaId: any;
        picId: any;
        sPackId: any;
        spackId: any;
        doMobeeCustomerString: string;
      };
      tncStatus: boolean;
    };
  };
  decisionPageRequired: false;
  data: {
    msg: string;
  };

}

// fetch().then(
//   ()
// )
