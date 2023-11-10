export interface LoanApplicationCompanyOrGroupModel {
  nameOfOrganization: string;
  dateOfIncorporation: string;
  registrationNumber: string;
  preferredCorrespondanceAddr: string;
  postalAddrPoBox: string;
  postalAddrTown: string;
  postalAddrCountry: string;
  bussAddrPlot: string;
  bussAddrLocation: string;
  bussAddrDistrict: string;
  bussAddrCountry: string;

  bussAddrTradingAs: string;
  numberOfContacts: string;
  primaryContactPreferredCommType: string;
  primaryContactMobNumber: string;
  primaryContactOtherContactNumber: string;
  primaryContactEmailAddress: string;
  fillStatus?: string;
}

export type LoanApplicationCompanyOrGroupPayloadModel = LoanApplicationCompanyOrGroupModel & {
  id: number;
  applicationId: string;
  sessionId: string;
};

export interface LoanApplicationCompanyOrGroupResponseModel {
  decisionPageRequired: boolean;
  status: 'SUCCESS' | 'FAILURE' | 'FAILED';
  statusCode: string;
  statusDesc: string;
  data: {
    legalPersona: LoanApplicationCompanyOrGroupPayloadModel;
  };

  // "legalPersona": {
  //     "id": 204,
  //     "applicationId": "2319419514",
  //     "sessionId": "58a33a49-b6e7-41f1-a8a0-4003f7b04612",
  //     "nameOfOrganization": "Botswana",
  //     "registrationNumber": "BW48484848484",
  //     "preferredCorrespondanceAddr": "jdj",
  //     "postalAddrPoBox": "jdjd",
  //     "postalAddrTown": "jdj",
  //     "bussAddrPlot": "jdjd",
  //     "bussAddrTradingAs": "",
  //     "bussAddrLocation": "",
  //     "bussAddrDistrict": "",
  //     "bussAddrCountry": "BW",
  //     "numberOfContacts": "",
  //     "primaryContactMobNumber": "267-76666666",
  //     "primaryContactOtherContactNumber": "",
  //     "primaryContactEmailAddress": "faizanur@gmail.com"
  // }
}
