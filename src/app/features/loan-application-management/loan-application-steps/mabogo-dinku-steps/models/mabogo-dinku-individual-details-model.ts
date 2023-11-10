export interface MabogoDinkuIndividualDetailsModel {
  id: number; // Unique identifier of the individual.
  title: string; // Title or salutation of the individual.
  fullName: string; // Full name of the individual.
  surname: string; // Surname or last name of the individual.

  dateOfBirth: string;

  maritalStatus: string;
  maritalRegime: string;

  botswanaCitizen: string; // Indicates whether the individual is a citizen of Botswana.
  omangNumber: string; // National identification number assigned by the government of Botswana.
  dateOfOmangExpiry: string; // Expiry date of the national identification card.
  gender: string;
  foreignPassportNumber: string; // Passport number of the individual, if they hold a foreign passport.
  foreignPassportExpiry: string;
  nationality: string; // Nationality of the individual.
  communicationType: string; // Type of communication preferred by the individual.
  mobileNumber: string; // Mobile phone number of the individual.
  mobileNumberStatus?: string; // Status of the mobile phone number.
  mobileNumberCountryCode?: string; // Country code for the mobile phone number.
  secondaryMobileNumber?: string;
  secondaryMobileNumberCountryCode?: string;
  otherContactNumberCountryCode?: string;
  otherContactNumber: string; // An alternate contact number for the individual.
  emailAddress: string; // Email address of the individual.
  emailAddressStatus?: string; // Status of the email address.
  corresspondanceAddress: string; // Correspondence address of the individual.
  addrPlot: string; // Plot number of the individual's address.
  addrSuburb: string; // Suburb of the individual's address.
  addrTown: string; // Town or city of the individual's address.
  addrCountry: string; // Country of the individual's address.
  addrDuration: string; // Duration of time that the individual has lived at their current address.
  postalAddrPoBox: string; // Postal address PO Box number.
  postalAddrCountry: string; // Country of the individual's postal address.
  postalAddrTown: string; // Town or city of the individual's postal address.
  bussAddrPlot: string; // Plot number of the individual's business address.
  bussAddrSuburb: string; // Suburb of the individual's business address.
  bussAddrTown: string; // Town or city of the individual's business address.
  bussAddrCountry: string; // Country of the individual's business address.

  bussAddrTradingAs: string; // Trading name of the individual's business.
  //   empNoOfJobs: string; // Number of jobs held by the individual.
  //   empDetails: EmpDetails[]; // Array of objects containing employment details of the individual.
  hvAddrPlot: string;
  hvAddrSuburb: string;
  hvAddrTown: string;
  hvAddrCountry: string;
  nkAddrPlot: string;
  nkAddrSuburb: string;
  nkAddrTown: string;
  nkAddrCountry: string;
  nkName: string;
  nkSurname: string;
  nkContact: string;
  nkContactCountryCode?: string;

  nkRelationship: string;

  nkAddrCountry2?: string; // Country of next of kin address 2
  nkAddrPlot2?: string; // Plot number for next of kin address 2
  nkAddrSuburb2?: string; // Suburb name for next of kin address 2
  nkAddrTown2?: string; // Town or city name for next of kin address 2
  nkName2?: string; // Name of next of kin 2
  nkSurname2?: string;
  nkContact2?: string; // Contact number for next of kin 2
  nkContact2CountryCode?: string;
  nkRelationship2?: string; // Relationship to next of kin 2

  disability: boolean; // Indicates whether the individual has a disability.
  disabilityType: string;
  disabilityDocuments: any;
  creditCheck: 'clean' | 'adverse' | null;
  fillStatus?: boolean;
}
