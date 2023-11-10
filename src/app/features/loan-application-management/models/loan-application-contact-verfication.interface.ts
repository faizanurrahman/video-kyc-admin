export interface LoanApplicationOtpGenRequestBean {
    newLoginBean: {
        loginId: string;
        transactionId: '24012023080821984256712345993';
    };
    serviceName: 'IB_CONTACT_VERIFY';
    requestId: '25671234599324012023080821984';
    sessionId: string;
    data: {
        CONTACT_TYPE: 'PHONE' | 'EMAIL' | 'NONE';
        CONTACT_NO?: string;
        CONTACT_EMAIL?: string;
        FOR_SERVICE: 'LOAN_APP';
    };
}

export interface LoanAppContactOtpGenResponseBean {
    status: 'SUCCESS';
    statusCode: '00';
    statusDesc: 'Confirmation Successfully Processed';
    instId: 1;
    serviceName: 'IB_CONTACT_VERIFY';
    requestId: '25671234599324012023080821984';
    sessionId: '5a8be1c3-afd6-45fd-9dd3-a10f4af58f76';
    newLoginBean: {
        statusCode: 'SUCCESS';
        statusDesc: 'Transaction Successful';
        loginId: 'zahid';
        customerId: '2000041046';
        mobileNumber: '26771307650';
        transactionId: '24012023080821984256712345993';
        instId: 1;
        tncStatus: false;
    };
    genericServiceBean: {
        channelId: 2001;
        serviceId: 9106;
        customerId: '33826';
        instId: 1;
        endSession: false;
        doMobeeCustomer: {
            acctPrimary: null;
            alertEmail: null;
            charges: null;
            custId: null;
            custName: null;
            dataSourceList: null;
            doSapBpQueryResponse: null;
            allAccList: null;
            instId: 1;
            langId: 1;
            mobileNumber: null;
            mvisaId: null;
            picId: null;
            sPackId: null;
            spackId: null;
            doMobeeCustomerString: 'null|1|null|null|\n';
        };
        sPackId: 2;
    };
    decisionPageRequired: false;
    data: {
        CONTACT_TYPE: 'PHONE';
        CONTACT_NO: '26777788899';
        FOR_SERVICE: 'LOAN_APP';
        confirmationMessage: null;
    };
}

export interface LoanApplicationOtpValidateRequestBean {
    newLoginBean: {
        loginId: string;
        transactionId: '24012023080821984256712345993';
    };
    serviceName: 'IB_CONTACT_VERIFY';
    requestId: '25671234599324012023080821984';
    sessionId: string;
    data: {
        FOR_SERVICE: 'LOAN_APP';
        ENTERED_OTP: string;
    };
}