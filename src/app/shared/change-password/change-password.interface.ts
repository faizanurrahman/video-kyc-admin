export interface ChangePasswordRequestBean {
    newLoginBean: {
        loginId: string;

        transactionId: '24012023080821984256712345993';
    };

    serviceName: 'IB_CHANGE_PASSWORD';

    requestId: '25671234599324012023080821984';

    sessionId: string;

    data: {
        CPIN_CURRENTPIN: string;
        CPIN_NEWPIN: string;
        CPIN_RENEWPIN: string;
    };
}

export interface ChangePasswordResponseBean {
    status: string;
    statusCode: string;
    statusDesc: string;
    instId: number;
    serviceName: 'IB_CHANGE_PASSWORD';
    requestId: string;
    sessionId: string;
    newLoginBean: {
        statusCode: string;
        statusDesc: string;
        loginId: string;
        customerId: string;
        mobileNumber: string;
        transactionId: string;
        instId: number;
        tncStatus: boolean;
    };
    genericServiceBean: {
        channelId: number;
        statusCode: string;
        statusDesc: string;
        serviceId: number;
        customerId: string;
        instId: number;
        endSession: boolean;
        resultSet: {
            className: string;
            response: string;
        };
        doMobeeCustomer: {
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
        };
        sPackId: number;
    };
    decisionPageRequired: boolean;
    data: {
        CPIN_CURRENTPIN: string;
        CPIN_NEWPIN: string;
        CPIN_RENEWPIN: string;
        msg: string;
    };
}