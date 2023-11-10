export interface DocumentFile {
  id: number;
  documentType: string;
  documentDescription: string;
  docPath: string;
  docName: string;

  individualId?: any;
}

export interface NewLoanDocsModel {
  groupBankAccountOpeningConfirmationLetter: DocumentFile[];
  certifiedCopiesOfOmang: DocumentFile[];
  threeQuationsOfItems: DocumentFile;
  consentFromLandBoard: DocumentFile;
  letterOfRequest: DocumentFile | null;
  financialProjectionsFor5years: DocumentFile;
  signedGroupConstitution: DocumentFile[];
  boreholeDrillingCompletion: DocumentFile;
  cvOfShareHolders: DocumentFile[];
  ranchEcologySite: DocumentFile;
  usageOfLand: DocumentFile;
  mapOfExistingBoreHole: DocumentFile;
  livestockBrandCertificate: DocumentFile;
  personalBalanceSheetsOfAllShareholders: DocumentFile;
  copyOfOmangForEachGroupMember: DocumentFile[];
  businessBankStatementFor6months: DocumentFile;
  copyOfNecessaryLicensesToOperate: DocumentFile | null;
  form5: DocumentFile | null;
  proofOfResidence: DocumentFile | null;
  form4: DocumentFile;
  provisionalOfferOfLand: DocumentFile;
  spouseMarriedId: DocumentFile | null;
  completedApplicationForm: DocumentFile | null;
  market: DocumentFile | null;
  franchiseeAgreement: DocumentFile | null;
  deedsMarriageInstrument: DocumentFile;
  copyOfLeaseAgreement: DocumentFile;
  leaseAgreement: DocumentFile | null;
  applicationFormAndBusinessPlan: DocumentFile;
  deedOfSale: DocumentFile;
  addDoc1: DocumentFile | null;
  addDoc2: DocumentFile | null;
  addDoc5: DocumentFile | null;
  groupBankAccountStatement: DocumentFile[];
  addDoc6: DocumentFile | null;
  form3: DocumentFile;
  addDoc3: DocumentFile | null;
  form2: DocumentFile;
  addDoc4: DocumentFile | null;
  addDoc9: DocumentFile | null;
  addDoc7: DocumentFile | null;
  addDoc8: DocumentFile | null;
  quotationForItemToFinanced: DocumentFile | null;
  taxClearanceCertificate: DocumentFile;
  proofOfPhysicalAddress: DocumentFile | null;
  proofOfPastBusinessActivity: DocumentFile[];
  groupMustHaveFiveToFifteenMember: DocumentFile[];
  financialProjections: DocumentFile | null;
  livestockCensus: DocumentFile;
  environmentImpactAssessment: DocumentFile;
  proofOfOwnership: DocumentFile | null;
  personalBankStatementFor12Months: DocumentFile;
  groupMemberMustResideWithingTwentyKm: DocumentFile[];
  companyProfile: DocumentFile | null;
  groupStartUpsRatio: DocumentFile[];
  proofOfEmploymentAndSalaryForEmployedMember: DocumentFile[];
  bankAccountConfirmationLetter: DocumentFile | null;
  proofOfTitleDeed: DocumentFile;
  addDoc10: DocumentFile | null;
  employedMemberIncome: DocumentFile[];
  professionalAndAcadamicCertificates: DocumentFile[];
  threeQuotationsForProposedDevelopment: DocumentFile[] | null;
  dueDilligenceReport: DocumentFile;
  marriageCertificate: DocumentFile;
  soilAndWaterTestsReport: DocumentFile;
  structuralReport: DocumentFile;
  conceptOfArchitecturalApprovedPlans: DocumentFile | null;
  additionalDocument: DocumentFile[];
  valuationReport: DocumentFile;
  resolutionByBod: DocumentFile;
  moaa: DocumentFile | null;
  creditWorthinessReport: DocumentFile[];
  billsOfQuantity: DocumentFile;
  approvedArchitecturalDrawings: DocumentFile | null;
  insuranceQuotations: DocumentFile;
  historicFinancials: DocumentFile | null;
  isCitizens: DocumentFile;
  letterOfIntent: DocumentFile;
  addDocs: DocumentFile[];
  auditedFinancialStatements: DocumentFile;
  disabilityDocument: DocumentFile[];
  cleanCreditCheckDocs: DocumentFile[];
  adverseCreditCheckDocs: DocumentFile[];
  fillStatus?: boolean;
}

export interface InvoiceProps {
  outputType: OutputType | string;
  returnJsPDFDocObject?: boolean;
  fileName: string;
  orientationLandscape?: boolean;
  compress?: boolean;
  logo?: {
    src?: string;
    type?: string;
    width?: number;
    height?: number;
    margin?: {
      top?: number;
      left?: number;
    };
  };
  stamp?: {
    inAllPages?: boolean;
    src?: string;
    type?: string;
    width?: number;
    height?: number;
    margin?: {
      top?: number;
      left?: number;
    };
  };
  business?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    email_1?: string;
    website?: string;
  };
  contact?: {
    label?: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    otherInfo?: string;
  };
  invoice?: {
    label?: string;
    num?: number;
    invDate?: string;
    invGenDate?: string;
    headerBorder?: boolean;
    tableBodyBorder?: boolean;
    header?: {
      title: string;
      style?: {
        width?: number;
      };
    }[];
    table?: any;
    invDescLabel?: string;
    invDesc?: string;
    additionalRows?: {
      col1?: string;
      col2?: string;
      col3?: string;
      style?: {
        fontSize?: number;
      };
    }[];
  };
  footer?: {
    text?: string;
  };
  pageEnable?: boolean;
  pageLabel?: string;
}

// Additional type definition for OutputType enum (if not already defined elsewhere)
interface OutputType {
  Save: 'save'; //save pdf as a file
  DataUriString: 'datauristring'; //returns the data uri string
  DataUri: 'datauri'; //opens the data uri in current window
  DataUrlNewWindow: 'dataurlnewwindow'; //opens the data uri in new window
  Blob: 'blob'; //return blob format of the doc,
  ArrayBuffer: 'arraybuffer'; //return ArrayBuffer format
}
