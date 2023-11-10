export interface MabogoDinkuGroupDetailsModel {
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
