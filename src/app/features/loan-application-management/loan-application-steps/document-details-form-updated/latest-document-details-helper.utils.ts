/* eslint-disable max-len */
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationType,
} from '../../models/loan-application.enum';

/**
  * updated controls names

  applicationFormAndBusinessPlan: [[]], // businessPlan
      companyProfile: [[]], // companyProfile
      certifiedCopiesOfOmang: [[]], // omangCopies
      resolutionByBod: [[]], // boardResolution
      letterOfRequest: [[]], // requestLetter
      companyExtract: [[]], // companyExtract // todo: new property
      incorporationCertificate: [[]], // incorporationCertificate // todo: new property
      auditedFinancialStatements: [[]], // auditedFinancials
      historicFinancials: [[]], // historicFinancials
      personalBankStatementFor12Months: [[]], // personalBankStatements
      businessBankStatementFor6months: [[]], //  businessBankStatements
      financialProjectionsFor5years: [[]], // financialProjections
      financialProjections: [[]], // financialProjectionsTradingFinance
      market: [[]], // marketDocuments
      personalBalanceSheetsOfAllShareholders: [[]], // personalBalanceSheets
      valuationReport: [[]], // valuationReport
      deedOfSale: [[]], // deedOfSale
      proofOfTitleDeed: [[]], // titleDeedProof
      billsOfQuantity: [[]], // quantityBills
      structuralReport: [[]], // structuralReport
      dueDilligenceReport: [[]], // dueDiligenceReport
      livestockBrandCertificate: [[]], // livestockBrandCert
      livestockCensus: [[]], // livestockCensus
      letterOfIntent: [[]], // lettersOfIntent
      threeQuationsOfItems: [[]], // itemQuotations
      insuranceQuotations: [[]], // insuranceQuotations
      soilAndWaterTestsReport: [[]], // soilWaterTests
      boreholeDrillingCompletion: [[]], // boreholeCompletionCert
      mapOfExistingBoreHole: [[]], // boreholeMap
      consentFromLandBoard: [[]], // landBoardConsent
      cvOfShareHolders: [[]], // shareholderCVs
      shareholderCertificates: [[]], // shareholderCertificates // todo: new property
      taxClearanceCertificate: [[]], // taxClearanceCert
      marriageCertificate: [[]], // marriageCertCopy
      deedsMarriageInstrument: [[]], // marriageInstrumentCopy
      environmentImpactAssessment: [[]], // EIAReport
      ranchEcologySite: [[]], // ranchEcologyReport
      KYCForms: [[]], // KYCForms // todo: new property
      conceptOfArchitecturalApprovedPlans: [[]], // architecturalDrawings
      copyOfLeaseAgreement: [[]], // leaseAgreementCopy
      copyOfNecessaryLicensesToOperate: [[]], // licenseCopy
      threeQuotationsForProposedDevelopment: [[]], // developmentQuotations
      proofOfOwnership: [[]], // landOwnershipProof
      franchiseeAgreement: [[]], // franchiseAgreement
      addDocs: [[]], // addDocs
 */
export interface LoanApplicationRequiredDocumentModel {
  controlName: string;
  labelName: string;
  documentName: string;
  longDescription: string;
  numberOfDocument: number;
  isRequired: boolean;

  extension: string;
  isMultiple: boolean;
  documentSize: number; // In Mega Bites
  isOptional?: boolean;
  isMandatory?: boolean;
  individualId?: any;
}

interface DocumentAdditonalDetailsInterface {
  labelName: string;
  documentName: string;
  longDescription: string;
}

export class LoanApplicationDocumentUtils {
  // Public API's
  public static getRequiredDocuments(
    sector: LoanApplicationSectorType,
    loanType: LoanApplicationType,
    productType: LoanApplicationProductType = 'cedaMainline',
  ): LoanApplicationRequiredDocumentModel[] {
    // console.log('Get Required Document Called in utlils');
    let requiredDocuments: LoanApplicationRequiredDocumentModel[] = [];

    let additionalDocumentDetailsMap = LoanApplicationDocumentUtils.documentAdditionalDetailsMap;
    let documentCountMap = LoanApplicationDocumentUtils.documentCountMap;
    let documentCount = 0;

    // For Every Loan Application
    for (let key in additionalDocumentDetailsMap) {
      if (additionalDocumentDetailsMap.hasOwnProperty(key)) {
        let controlName = key;
        let documentDetails = additionalDocumentDetailsMap[controlName];

        switch (sector) {
          case 'agriBusiness':
          case 'AgriBusiness':
          case 'agribusiness':
            switch (loanType) {
              case 'individual':
              case 'Individual':
                const agriIndividualRequiredDocuments =
                  LoanApplicationDocumentUtils.agriBusinessIndividualRequiredDocument;

                documentCount = documentCountMap.get(controlName)?.numberOfDocsForIndividual!;

                // console.log('documentCount', documentCount);
                // console.log('agriIndividualRequiredDocuments', agriIndividualRequiredDocuments);

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    agriIndividualRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              case 'company':
              case 'mabogoDinku':
              case 'mabogodinku':
              case 'Mabogo Dinku':
              case 'group':
              case 'Company':
              case 'Group':
              case 'GROUP':
                const agriCompanyGroupRequiredDocuments =
                  LoanApplicationDocumentUtils.agriBusinessCompanyGroupRequiredDocument;

                documentCount = documentCountMap.get(controlName)?.numberOfDocsForCompanyGroup!;

                // console.log('item pushed to group or company');

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    agriCompanyGroupRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              default:
                break;
            } // end of loan type switch
            break; // end of agribusiness
          case 'manufacturing':
          case 'Manufacturing':
            switch (loanType) {
              case 'individual':
              case 'Individual':
                const manufacturingIndividualRequiredDocuments =
                  LoanApplicationDocumentUtils.manufacturingIndividualRequiredDocument;

                documentCount = documentCountMap.get(controlName)?.numberOfDocsForIndividual!;

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    manufacturingIndividualRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              case 'company':
              case 'mabogoDinku':
              case 'mabogodinku':
              case 'Mabogo Dinku':
              case 'group':
              case 'Company':
              case 'Group':
              case 'GROUP':
                const manufacturingCompanyGroupRequiredDocuments =
                  LoanApplicationDocumentUtils.manufacturingCompanyGroupRequiredDocument;
                documentCount = documentCountMap.get(controlName)?.numberOfDocsForCompanyGroup!;

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    manufacturingCompanyGroupRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              default:
                break;
            } // end of loan type switch
            break; // end of manufacturing
          case 'property':
          case 'Property':
            switch (loanType) {
              case 'individual':
              case 'Individual':
                const propertyIndividualRequiredDocuments =
                  LoanApplicationDocumentUtils.propertyIndividualRequiredDocument;
                documentCount = documentCountMap.get(controlName)?.numberOfDocsForIndividual!;

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    propertyIndividualRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              case 'company':
              case 'mabogoDinku':
              case 'mabogodinku':
              case 'Mabogo Dinku':
              case 'group':
              case 'Company':
              case 'Group':
              case 'GROUP':
                const propertyCompanyGroupRequiredDocuments =
                  LoanApplicationDocumentUtils.propertyCompanyGroupRequiredDocument;
                documentCount = documentCountMap.get(controlName)?.numberOfDocsForCompanyGroup!;

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    propertyCompanyGroupRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              default:
                break;
            } // end of loan type switch
            break; // end of property

          case 'services':
          case 'Services':
            switch (loanType) {
              case 'individual':
              case 'Individual':
                const servicesIndividualRequiredDocuments =
                  LoanApplicationDocumentUtils.servicesIndividualRequiredDocument;
                documentCount = documentCountMap.get(controlName)?.numberOfDocsForIndividual!;

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    servicesIndividualRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              case 'company':
              case 'mabogoDinku':
              case 'mabogodinku':
              case 'Mabogo Dinku':
              case 'group':
              case 'Company':
              case 'Group':
              case 'GROUP':
                const servicesCompanyGroupRequiredDocuments =
                  LoanApplicationDocumentUtils.servicesCompanyGroupRequiredDocument;
                documentCount = documentCountMap.get(controlName)?.numberOfDocsForCompanyGroup!;

                requiredDocuments.push(
                  LoanApplicationDocumentUtils.getRequiredDocumentFrom(
                    controlName,
                    documentDetails,
                    servicesCompanyGroupRequiredDocuments,
                    documentCount,
                  ),
                );
                break;
              default:
                break;
            } // end of loan type switch

            break; // end of services
        }

        if (productType === 'tradeFinance') {
          let tradeFinanceRequiredDocuments =
            LoanApplicationDocumentUtils.tradeFinanceIndividualRequiredDocuement;
          documentCount = documentCountMap.get(controlName)?.numberOfDocsForIndividual!;

          if (
            loanType === 'Company' ||
            loanType === 'company' ||
            loanType === 'group' ||
            loanType === 'GROUP' ||
            loanType === 'mabogoDinku' ||
            loanType === 'mabogodinku' ||
            loanType === 'Mabogo Dinku'
          ) {
            tradeFinanceRequiredDocuments =
              LoanApplicationDocumentUtils.tradeFinanceCompanyGroupRequiredDocuement;
            documentCount = documentCountMap.get(controlName)?.numberOfDocsForCompanyGroup!;
          }

          const documentIs = LoanApplicationDocumentUtils.getRequiredDocumentFrom(
            controlName,
            documentDetails,
            tradeFinanceRequiredDocuments,
            documentCount,
          );

          // replace this document in existing required documents
          requiredDocuments = requiredDocuments.map((document) => {
            if (document.controlName === documentIs.controlName) {
              return documentIs;
            } else {
              return document;
            }
          });
        }
      }
    }

    // For Group and Mabogo Dinku
    // For Group Only
    if (loanType === 'group' || loanType === 'GROUP' || loanType === 'Group') {
      let groupAddtionalDocumentDetailsMap =
        LoanApplicationDocumentUtils.forGroupOnlyAdditionalDetailsMap;
      for (let key in groupAddtionalDocumentDetailsMap) {
        if (groupAddtionalDocumentDetailsMap.hasOwnProperty(key)) {
          let documentDetails = groupAddtionalDocumentDetailsMap[key];
          let requiredMap = LoanApplicationDocumentUtils.onlyForGroupRequiredDocument;
          let documentCount = documentCountMap.get(key)?.numberOfDocsForCompanyGroup!;

          requiredDocuments.push(
            LoanApplicationDocumentUtils.getRequiredDocumentFrom(
              key,
              documentDetails,
              requiredMap,
              documentCount,
            ),
          );
        }
      }
    }

    // For Maboogo Dinku Only
    if (loanType === 'mabogoDinku' || loanType === 'mabogodinku' || loanType === 'Mabogo Dinku') {
      let mabogoDinkuAddtionalDocumentDetailsMap =
        LoanApplicationDocumentUtils.forMabogoDinkuOnlyAdditionalDetailsMap;
      for (let key in mabogoDinkuAddtionalDocumentDetailsMap) {
        if (mabogoDinkuAddtionalDocumentDetailsMap.hasOwnProperty(key)) {
          let documentDetails = mabogoDinkuAddtionalDocumentDetailsMap[key];
          let requiredMap = LoanApplicationDocumentUtils.onlyForMobagoDinku;
          let documentCount = documentCountMap.get(key)?.numberOfDocsForCompanyGroup!;

          requiredDocuments.push(
            LoanApplicationDocumentUtils.getRequiredDocumentFrom(
              key,
              documentDetails,
              requiredMap,
              documentCount,
            ),
          );
        }
      }
    }

    // console.log('Required Documents: ', requiredDocuments);

    return requiredDocuments;
  }

  public static getRequiredDocumentFrom(
    controlName: string,
    documentDetails: any,
    requiredDocumentMap: any,
    requiredDocumentCount: any,
  ) {
    const documentName = documentDetails.documentName;
    const labelName = documentDetails.labelName;
    const documentDescription = documentDetails.longDescription;
    const documentCount = requiredDocumentCount;
    const isRequired = requiredDocumentMap.get(controlName).required ? true : false;
    const extension = '.pdf,.jpg,.png,.jpeg';
    const isMultiple = (documentCount ? documentCount : 1) > 1 ? true : false;
    const isMandatory = requiredDocumentMap.get(controlName).mandatory ? true : false;
    const isOptional = !isMandatory;

    return {
      controlName: controlName,
      documentName: documentName,
      labelName: labelName,
      longDescription: documentDescription,
      numberOfDocument: documentCount,
      extension: extension,
      isMultiple: isMultiple,
      isRequired: isRequired,
      documentSize: 10,
      isMandatory: isMandatory,
      isOptional: isOptional,
    };
  }

  // use above updated controls
  private static controlNames: string[] = [
    'applicationFormAndBusinessPlan',
    'companyProfile',
    'certifiedCopiesOfOmang',
    'resolutionByBod',
    'letterOfRequest',
    'companyExtract',
    'incorporationCertificate',
    'auditedFinancialStatements',
    'historicFinancials',
    'personalBankStatementFor12Months',
    'businessBankStatementFor6months',
    'financialProjectionsFor5years',
    'financialProjections',
    'market',
    'personalBalanceSheetsOfAllShareholders',
    'valuationReport',
    'deedOfSale',
    'proofOfTitleDeed',
    'billsOfQuantity',
    'structuralReport',
    'dueDilligenceReport',
    'livestockBrandCertificate',
    'livestockCensus',
    'letterOfIntent',
    'threeQuationsOfItems',
    'insuranceQuotations',
    'soilAndWaterTestsReport',
    'boreholeDrillingCompletion',
    'mapOfExistingBoreHole',
    'consentFromLandBoard',
    'cvOfShareHolders',
    'shareholderCertificates',
    'taxClearanceCertificate',
    'marriageCertificate',
    'deedsMarriageInstrument',
    'environmentImpactAssessment',
    'ranchEcologySite',
    'KYCForms',
    'conceptOfArchitecturalApprovedPlans',
    'copyOfLeaseAgreement',
    'copyOfNecessaryLicensesToOperate',
    'threeQuotationsForProposedDevelopment',
    'proofOfOwnership',
    'franchiseeAgreement',
    'addDocs',

    // New Controls
    // - For Groups Only
    'proofOfPhysicalAddress',
    'creditWorthinessReport',
    'groupBankAccountOpeningConfirmationLetter',
    'groupBankAccountStatement',
    'signedGroupConstitution',
    'groupMustHaveFiveToFifteenMember',
    'groupMemberMustResideWithingTwentyKm',
    'groupStartUpsRatio',
    'employedMemberIncome',
    'proofOfEmploymentAndSalaryForEmployedMember',
    'copyOfOmangForEachGroupMember',

    // - For Mabogo Dinku Only
    'completedApplicationForm',
    'spouseMarriedId',
    'quotationForItemToFinanced',
    'proofOfPastBusinessActivity',
    'bankAccountConfirmationLetter',
  ];

  private static documentCountMap: Map<
    string,
    { numberOfDocsForCompanyGroup: number; numberOfDocsForIndividual: number }
  > = new Map([
    [
      'applicationFormAndBusinessPlan',
      { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 },
    ],
    ['companyProfile', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    [
      'certifiedCopiesOfOmang',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 1 },
    ],
    ['resolutionByBod', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 0 }],
    ['letterOfRequest', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['companyExtract', { numberOfDocsForCompanyGroup: 33333, numberOfDocsForIndividual: 0 }],
    ['incorporationCertificate', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 0 }],
    [
      'auditedFinancialStatements',
      { numberOfDocsForCompanyGroup: 33333, numberOfDocsForIndividual: 33333 },
    ],
    [
      'historicFinancials',
      { numberOfDocsForCompanyGroup: 33333, numberOfDocsForIndividual: 33333 },
    ],
    [
      'personalBankStatementFor12Months',
      { numberOfDocsForCompanyGroup: 12121, numberOfDocsForIndividual: 12121 },
    ],
    [
      'businessBankStatementFor6months',
      { numberOfDocsForCompanyGroup: 66666, numberOfDocsForIndividual: 66666 },
    ],
    [
      'financialProjectionsFor5years',
      { numberOfDocsForCompanyGroup: 33333, numberOfDocsForIndividual: 33333 },
    ],
    [
      'financialProjections',
      {
        numberOfDocsForCompanyGroup: 1,
        numberOfDocsForIndividual: 1,
      },
    ],
    ['market', { numberOfDocsForCompanyGroup: 55555, numberOfDocsForIndividual: 55555 }],
    [
      'personalBalanceSheetsOfAllShareholders',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    ['valuationReport', { numberOfDocsForCompanyGroup: 55555, numberOfDocsForIndividual: 55555 }],
    ['deedOfSale', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['proofOfTitleDeed', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['billsOfQuantity', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['structuralReport', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['dueDilligenceReport', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['livestockBrandCertificate', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['livestockCensus', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 55555 }],
    ['letterOfIntent', { numberOfDocsForCompanyGroup: 33333, numberOfDocsForIndividual: 33333 }],
    [
      'threeQuationsOfItems',
      { numberOfDocsForCompanyGroup: 10000, numberOfDocsForIndividual: 10000 },
    ],
    [
      'insuranceQuotations',
      { numberOfDocsForCompanyGroup: 33333, numberOfDocsForIndividual: 33333 },
    ],
    ['soilAndWaterTestsReport', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    [
      'boreholeDrillingCompletion',
      { numberOfDocsForCompanyGroup: 22222, numberOfDocsForIndividual: 22222 },
    ],
    ['mapOfExistingBoreHole', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['consentFromLandBoard', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['cvOfShareHolders', { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 1 }],
    [
      'shareholderCertificates',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 1 },
    ],
    ['taxClearanceCertificate', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['marriageCertificate', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['deedsMarriageInstrument', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    [
      'environmentImpactAssessment',
      { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 },
    ],
    ['ranchEcologySite', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    ['KYCForms', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    [
      'conceptOfArchitecturalApprovedPlans',
      { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 },
    ],
    ['copyOfLeaseAgreement', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    [
      'copyOfNecessaryLicensesToOperate',
      { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 },
    ],
    [
      'threeQuotationsForProposedDevelopment',
      { numberOfDocsForCompanyGroup: 33333, numberOfDocsForIndividual: 33333 },
    ],
    ['proofOfOwnership', { numberOfDocsForCompanyGroup: 1, numberOfDocsForIndividual: 1 }],
    [
      'franchiseeAgreement',
      { numberOfDocsForCompanyGroup: 22222, numberOfDocsForIndividual: 22222 },
    ],
    ['addDocs', { numberOfDocsForCompanyGroup: 10, numberOfDocsForIndividual: 10 }],

    // - For Group Only
    [
      'proofOfPhysicalAddress',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'creditWorthinessReport',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'groupBankAccountOpeningConfirmationLetter',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'groupBankAccountStatement',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'signedGroupConstitution',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'groupMustHaveFiveToFifteenMember',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'groupMemberMustResideWithingTwentyKm',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    ['groupStartUpsRatio', { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 }],
    ['employedMemberIncome', { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 }],
    [
      'proofOfEmploymentAndSalaryForEmployedMember',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'copyOfOmangForEachGroupMember',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],

    // - For Mabogo Dinku Only
    [
      'completedApplicationForm',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    ['spouseMarriedId', { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 }],
    [
      'quotationForItemToFinanced',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'proofOfPastBusinessActivity',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],
    [
      'bankAccountConfirmationLetter',
      { numberOfDocsForCompanyGroup: 11111, numberOfDocsForIndividual: 0 },
    ],

    //
  ]);

  private static documentAdditionalDetailsMap: Record<string, DocumentAdditonalDetailsInterface> = {
    applicationFormAndBusinessPlan: {
      labelName: 'Business Plan',
      documentName: 'Business Plan/Plan with all areas adequately covered',
      longDescription:
        'A comprehensive plan outlining all the areas and aspects of the business venture, including market analysis, financial projections, and operational strategies.',
    },
    companyProfile: {
      labelName: 'Company Profile',
      documentName: 'Company Profile or business brief for new projects',
      longDescription:
        'A summary or brief overview of the company or business, particularly for new projects, outlining its background, expertise, and objectives.',
    },
    certifiedCopiesOfOmang: {
      labelName: 'Certified Copies of Omang',
      documentName:
        'Certified copies of Omang (Individuals, partners, shareholders, and directors)',
      longDescription:
        "Certified copies of the identification document known as 'Omang' for individuals, partners, shareholders, and directors involved in the business.",
    },
    resolutionByBod: {
      labelName: 'Resolution by Board of Directors',
      documentName: 'Resolution by Board of Directors to apply for a loan',
      longDescription:
        'A formal resolution passed by the board of directors of the company, authorizing the application for a loan or financing.',
    },
    letterOfRequest: {
      labelName: 'Letter of Request',
      documentName: 'Letter of Request',
      longDescription:
        'A written letter or document requesting a specific action or permission, usually addressed to the relevant authority or organization.',
    },
    companyExtract: {
      labelName: 'Company Extract Documents',
      documentName: 'Company Extract Documents',
      longDescription:
        "Official documents or extracts obtained from the company registry or relevant authorities, providing information about the company's legal status, directors, and shareholders.",
    },
    incorporationCertificate: {
      labelName: 'Certificate of Incorporation',
      documentName: 'Certificate of Incorporation',
      longDescription:
        "A legal document issued by the appropriate government authority, confirming the company's registration and incorporation.",
    },
    auditedFinancialStatements: {
      labelName: 'Audited Financial Statements',
      documentName:
        'Audited Financial statements for at least 3 years (in case of existing operations) (Prepared by a BICA accredited firm)',
      longDescription:
        'Detailed financial statements, including balance sheet, income statement, and cash flows, for at least three years, prepared by a BICA accredited firm.',
    },
    historicFinancials: {
      labelName: 'Historic Financials',
      documentName: 'Historic financials (for operating projects)',
      longDescription:
        "Financial statements and records of past performance for operating projects, providing insights into the company's financial history.",
    },
    personalBankStatementFor12Months: {
      labelName: 'Personal Bank Statements',
      documentName:
        'Personal Bank Statements for 12 months (start-ups or/and individual directors)',
      longDescription:
        'Bank statements of individual directors or start-ups for the past 12 months, demonstrating personal financial stability and transactions.',
    },
    businessBankStatementFor6months: {
      labelName: 'Business Bank Statements',
      documentName: 'Business Bank statements for at least 6 months.',
      longDescription:
        'Bank statements of the business or company for a minimum period of six months, reflecting financial activities and transactions.',
    },
    financialProjectionsFor5years: {
      labelName: 'Financial Projections',
      documentName:
        'Financial projections (Balance Sheet, Income Statement & Cashflows) for 5 years',
      longDescription:
        'Projected financial statements, including balance sheet, income statement, and cash flow projections, for a period of five years.',
    },
    financialProjections: {
      labelName: 'Financial Projections',
      documentName:
        'Financial projections (Balance Sheet, Income Statement & Cashflows) for 5 years',
      longDescription:
        'Projected financial statements, including balance sheet, income statement, and cash flow projections, for a period of five years.',
    },
    market: {
      labelName: 'Market',
      documentName: 'Market (i.e. Tender awarded/purchase orders/contracts)',
      longDescription:
        "Documents proving the company's market presence, such as tender awards, purchase orders, or contracts with clients or customers.",
    },
    personalBalanceSheetsOfAllShareholders: {
      labelName: 'Personal Balance Sheets',
      documentName: 'Personal Balance sheets of all shareholders',
      longDescription:
        'Balance sheets summarizing the personal assets, liabilities, and net worth of all shareholders involved in the business.',
    },
    valuationReport: {
      labelName: 'Valuation Report',
      documentName:
        'Valuation Report of existing assets, prepared by a professional valuer (the report must not be more than 2 years)',
      longDescription:
        'A report prepared by a professional valuer, assessing the value of existing assets owned by the company, ensuring it is not more than two years old.',
    },
    deedOfSale: {
      labelName: 'Deed of Sale of Business',
      documentName: 'Deed of sale of business in the event of purchase of an existing business',
      longDescription:
        'A legal document or agreement outlining the terms and conditions of the sale of an existing business, including the transfer of ownership rights.',
    },
    proofOfTitleDeed: {
      labelName: 'Proof of Title Deed',
      documentName: 'Proof of title deed for the property to be purchased or used as security',
      longDescription:
        'Documentary evidence or proof establishing the ownership of the property that will be purchased or used as security for the business.',
    },
    billsOfQuantity: {
      labelName: 'Bills of Quantity',
      documentName: 'Bills of Quantity from a registered Quantity Surveyor (where applicable)',
      longDescription:
        'Detailed itemized lists of quantities, materials, and costs related to construction or development projects, prepared by a registered Quantity Surveyor.',
    },
    structuralReport: {
      labelName: 'Structural Report',
      documentName:
        'Structural Report prepared by a certified Structural Engineer (the report must not be more than 2 years)',
      longDescription:
        'A report prepared by a certified Structural Engineer, assessing the structural integrity and safety of a building or infrastructure, within a maximum period of two years.',
    },
    dueDilligenceReport: {
      labelName: 'Due Diligence Report',
      documentName:
        'Due Diligence report valid for 12 months must be provided (in case of existing operations)',
      longDescription:
        "A comprehensive report conducted as part of the due diligence process, evaluating the company's operations, finances, legal compliance, and potential risks, valid for 12 months.",
    },
    livestockBrandCertificate: {
      labelName: 'Livestock Brand Certificate',
      documentName: 'Livestock brand certificate (where applicable)/Animal Production',
      longDescription:
        'A certificate or proof of registration for livestock branding, applicable in cases related to animal production or agriculture.',
    },
    livestockCensus: {
      labelName: 'Livestock Census',
      documentName: 'Livestock Census (Animal Production Only)',
      longDescription:
        'A survey or census conducted to determine the population, demographics, and characteristics of livestock animals, specifically in the context of animal production.',
    },
    letterOfIntent: {
      labelName: 'Letters of Intent/Contracts',
      documentName: 'Letters of Intent/Contracts ', // previous name: Letters of Intent/Contracts(3)
      longDescription:
        'Letters of Intent or contracts indicating the intention or commitment to engage in business relationships or transactions with clients, suppliers, or partners.',
    },
    threeQuationsOfItems: {
      labelName: 'Quotations of Items',
      documentName: 'Three quotations of items to be financed',
      longDescription:
        'Three written quotations or estimates obtained from suppliers or vendors, specifying the costs and details of items to be financed.',
    },
    insuranceQuotations: {
      labelName: 'Insurance Quotations',
      documentName: 'Insurance quotations for assets to be financed', // previous name: ...(3)
      longDescription:
        'Three insurance quotations obtained for the assets or properties to be financed, providing information on coverage, premiums, and terms.',
    },
    soilAndWaterTestsReport: {
      labelName: 'Soil and Water Tests Report',
      documentName:
        'Soil and water tests report (For horticulture, dry land farming, and livestock)',
      longDescription:
        'A report presenting the results of tests conducted on soil and water, particularly applicable in the context of horticulture, dry land farming, or livestock production.',
    },
    boreholeDrillingCompletion: {
      labelName: 'Borehole Drilling Completion Certificate',
      documentName: 'Borehole drilling completion certificate, proof of ownership',
      longDescription:
        'A certificate confirming the completion of borehole drilling and providing proof of ownership of the borehole, typically relevant in water resource projects.',
    },
    mapOfExistingBoreHole: {
      labelName: 'Map of Existing Borehole',
      documentName: 'Map of existing borehole (Site Map)',
      longDescription:
        'A visual representation or map indicating the location and details of an existing borehole, usually used for reference or planning purposes.',
    },
    consentFromLandBoard: {
      labelName: 'Consent from Land Board',
      documentName: 'Consent from Land Board to reticulate water from one plot to another (Leeway)',
      longDescription:
        'Official consent or approval obtained from the Land Board, allowing the reticulation or transfer of water from one plot or property to another, often required in water management projects.',
    },
    cvOfShareHolders: {
      labelName: 'CVs of Shareholders & Directors',
      documentName: 'CVs of Shareholders & Directors and/or Management',
      longDescription:
        'Curriculum Vitae (CVs) or resumes of the shareholders, directors, and/or management personnel associated with the company, highlighting their qualifications and professional backgrounds.',
    },
    shareholderCertificates: {
      labelName: 'Professional and Academic Certificates',
      documentName: 'Professional and academic certificates of all shareholders or owners',
      longDescription:
        'Copies or proof of professional and academic certificates of all shareholders or owners involved in the business, validating their qualifications and expertise.',
    },
    taxClearanceCertificate: {
      labelName: 'Tax Clearance Certificate',
      documentName: 'Tax Clearance Certificate where applicable',
      longDescription:
        'A certificate issued by the tax authority, confirming that the company or individual is cleared of any outstanding tax liabilities, applicable as per the tax regulations.',
    },
    marriageCertificate: {
      labelName: 'Certified Copy of Marriage Certificate',
      documentName: 'Certified Copy of Marriage Certificate where applicable',
      longDescription:
        'A certified copy of the marriage certificate, provided when applicable to establish the marital status or relationship of an individual involved in the business.',
    },
    deedsMarriageInstrument: {
      labelName: 'Copy of Deeds Marriage Instrument',
      documentName: 'Copy of Deeds Marriage Instrument (Form A or Form B)',
      longDescription:
        'A copy of the Deeds Marriage Instrument, such as Form A or Form B, used to register marriages and legally document the marital relationship, as required in certain jurisdictions.',
    },
    environmentImpactAssessment: {
      labelName: 'Environment Impact Assessment Report',
      documentName: 'Environment Impact Assessment Report (EIA) where necessary',
      longDescription:
        'A comprehensive report assessing the potential environmental impacts of a proposed project or business activity, as required by environmental regulations.',
    },
    ranchEcologySite: {
      labelName: 'Ranch Ecology Site Assessment Report',
      documentName: 'Ranch Ecology Site Assessment Report',
      longDescription:
        'A site-specific assessment report focusing on the ecological aspects and considerations related to a ranch or livestock production site.',
    },
    KYCForms: {
      labelName: 'Know Your Customer (KYC) Forms',
      documentName: 'Know Your Customer forms and proof of residence',
      longDescription:
        'Forms and documentation collected as part of the Know Your Customer (KYC) process, including proof of residence, to verify the identity and background of customers or clients.',
    },
    conceptOfArchitecturalApprovedPlans: {
      labelName: 'Approved Architectural Drawings',
      documentName: 'Approved Architectural Drawings (in the case of property development)',
      longDescription:
        'Architectural drawings or plans approved by the relevant authorities, detailing the design and layout of a property or building, typically for property development projects.',
    },
    copyOfLeaseAgreement: {
      labelName: 'Copy of Lease Agreement',
      documentName:
        'Copy of lease Agreement / Provisional lease agreement (in case of leased premises)',
      longDescription:
        'A copy of the lease agreement or provisional lease agreement, obtained in cases where the premises or property is leased, outlining the terms and conditions of the lease.',
    },
    copyOfNecessaryLicensesToOperate: {
      labelName: 'Copy of Necessary Licenses',
      documentName: 'Copy of necessary licenses to operate',
      longDescription:
        'Copies or documentation of the necessary licenses, permits, or certificates required to legally operate the business, ensuring compliance with applicable regulations.',
    },
    threeQuotationsForProposedDevelopment: {
      labelName: 'Quotations for Proposed Development',
      documentName:
        'Three quotations for the proposed development (Contractors company documents & profiles should be included, e.g., PPADB registration, Tax clearance certificate)',
      longDescription:
        'Three written quotations obtained for the proposed development, including detailed company documents and profiles of contractors, such as PPADB registration and tax clearance certificates.',
    },
    proofOfOwnership: {
      labelName: 'Proof of Land Ownership',
      documentName: 'Proof of ownership or availability of land for the project',
      longDescription:
        'Documentation or evidence proving the ownership or availability of land for the project, ensuring the company has the legal right to use the land as required.',
    },
    franchiseeAgreement: {
      labelName: 'Franchise Agreement',
      documentName: 'Franchise Agreement (where applicable)',
      longDescription:
        'A legal agreement between the franchisor and the franchisee, outlining the terms and conditions of the franchise arrangement, applicable when entering into a franchise agreement.',
    },

    // ---------------- Additonal Documents ----------------
    addDocs: {
      labelName: 'Addtional Documents',
      documentName: 'Addtional Documents',
      longDescription:
        'Upload any additional relevant documents to support your loan application, such as proof of collateral, financial statements, project plans, contracts, or any other supporting documentation. Providing comprehensive and accurate additional documents can expedite the loan review process and increase your approval chances. Ensure that all uploaded documents are clear and legible.',
    },
    disabilityDocument: {
      labelName: 'Disability Document',
      documentName: 'Disability Document',
      longDescription:
        'A document that serves as proof of disability, such as a medical certificate or disability card.',
    },
  };

  private static forGroupOnlyAdditionalDetailsMap: Record<
    string,
    DocumentAdditonalDetailsInterface
  > = {
    // - For Groups Only
    proofOfPhysicalAddress: {
      labelName: 'Proof of Physical Address',
      documentName: 'Document proving the physical address of the group',
      longDescription:
        "A document that serves as proof of the physical address of the group. It can be a utility bill, lease agreement, or any official document displaying the group's address.",
    },
    creditWorthinessReport: {
      labelName: 'Credit Worthiness Report',
      documentName: 'Credit worthiness report for the group',
      longDescription:
        'A report that assesses the credit worthiness of the group, evaluating factors such as credit history, financial stability, and repayment capability.',
    },
    groupBankAccountOpeningConfirmationLetter: {
      labelName: 'Group Bank Account Opening Confirmation Letter',
      documentName:
        'Confirmation letter from the bank regarding the opening of a group bank account',
      longDescription:
        "A letter issued by the bank confirming the successful opening of a bank account for the group. It verifies the existence of the group's bank account.",
    },
    groupBankAccountStatement: {
      labelName: 'Group Bank Account Statement',
      documentName: 'Latest bank account statement for the group',
      longDescription:
        "The most recent bank account statement showing the financial transactions and balances of the group's bank account.",
    },
    signedGroupConstitution: {
      labelName: 'Signed Group Constitution',
      documentName: 'Officially signed constitution or bylaws of the group',
      longDescription:
        'The constitution or bylaws of the group that have been properly signed by the authorized representatives. It outlines the rules, structure, and governance of the group.',
    },
    groupMustHaveFiveToFifteenMember: {
      labelName: 'Group Must Have Five to Fifteen Members',
      documentName:
        'Documentation proving the group has a membership of five to fifteen individuals',
      longDescription:
        'Documentation that demonstrates the group has a membership of at least five to fifteen individuals. This can include membership forms, identification documents, or any other relevant evidence.',
    },
    groupMemberMustResideWithingTwentyKm: {
      labelName: 'Group Member Must Reside Within Twenty Kilometers',
      documentName:
        'Proof of residence showing that group members live within a twenty-kilometer radius',
      longDescription:
        'Documents providing proof of residence for group members, specifically indicating that they reside within a twenty-kilometer radius from a specified location.',
    },
    groupStartUpsRatio: {
      labelName: 'Group Start-ups Ratio',
      documentName: 'Ratio calculation demonstrating the number of start-ups within the group',
      longDescription:
        'A calculation or ratio that illustrates the number of start-up businesses within the group compared to the total number of members. It highlights the entrepreneurial composition of the group.',
    },
    employedMemberIncome: {
      labelName: 'Employed Member Income',
      documentName: 'Proof of income for employed members within the group',
      longDescription:
        'Documentation providing evidence of the income earned by employed members within the group. It can include pay stubs, employment contracts, or any other relevant income verification documents.',
    },
    proofOfEmploymentAndSalaryForEmployedMember: {
      labelName: 'Proof of Employment and Salary for Employed Member',
      documentName:
        'Documentation verifying the employment status and salary of an employed member',
      longDescription:
        'Documents that confirm the employment status and salary details of an employed member within the group. It validates their source of income and employment stability.',
    },
    copyOfOmangForEachGroupMember: {
      labelName: 'Copy of Omang for Each Group Member',
      documentName: 'Certified copies of Omang for every individual group member',
      longDescription:
        "Certified copies of the identification document known as 'Omang' for each individual group member. It ensures the verification of the identities of all members involved in the group.",
    },
  };

  private static forMabogoDinkuOnlyAdditionalDetailsMap: Record<
    string,
    DocumentAdditonalDetailsInterface
  > = {
    // - For Mabogo Dinku Only
    completedApplicationForm: {
      labelName: 'Completed Application Form',
      documentName: 'Fully filled and completed application form',
      longDescription:
        'An application form that has been filled out completely and accurately, providing all the required information and details for the Mabogo Dinku program.',
    },
    spouseMarriedId: {
      labelName: 'Spouse Married ID',
      documentName: 'Identification document showing the marital status of the spouse',
      longDescription:
        "An identification document that demonstrates the marital status of the applicant's spouse, such as a marriage certificate or any other relevant proof of marriage.",
    },
    quotationForItemToFinanced: {
      labelName: 'Quotation for Item to be Financed',
      documentName: 'Quotation or cost estimate for the specific item that requires financing',
      longDescription:
        'A formal quotation or cost estimate for the particular item or asset that is being requested for financing through the Mabogo Dinku program.',
    },
    proofOfPastBusinessActivity: {
      labelName: 'Proof of Past Business Activity',
      documentName: 'Evidence showcasing previous business activities or ventures',
      longDescription:
        'Documentation or evidence that demonstrates the past business activities or ventures undertaken by the applicant. It can include invoices, contracts, receipts, or any other relevant records.',
    },
    bankAccountConfirmationLetter: {
      labelName: 'Bank Account Confirmation Letter',
      documentName: "Confirmation letter from the bank verifying the applicant's bank account",
      longDescription:
        "A letter issued by the bank confirming the existence and details of the applicant's bank account. It serves as proof of the applicant's banking relationship and account status.",
    },
  };

  // =====  Actual Data =====

  private static agriBusinessCompanyGroupRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: true, mandatory: true }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: true, mandatory: true }],
    ['incorporationCertificate', { required: true, mandatory: true }],
    ['auditedFinancialStatements', { required: true, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: false }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: true, mandatory: false }],
    ['livestockCensus', { required: true, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: true, mandatory: false }],
    ['boreholeDrillingCompletion', { required: true, mandatory: true }],
    ['mapOfExistingBoreHole', { required: true, mandatory: false }],
    ['consentFromLandBoard', { required: true, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: true, mandatory: false }],
    ['ranchEcologySite', { required: true, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: false }],
    ['proofOfOwnership', { required: true, mandatory: false }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],

    // // For Groups Only
    // ['proofOfPhysicalAddress', false],
    // ['creditWorthinessReport', false],
    // ['groupBankAccountOpeningConfirmationLetter', false],
    // ['groupBankAccountStatement', false],
    // ['signedGroupConstitution', false],
    // ['groupMustHaveFiveToFifteenMember', false],
    // ['groupMemberMustResideWithingTwentyKm', false],
    // ['groupStartUpsRatio', false],
    // ['employedMemberIncome', false],
    // ['proofOfEmploymentAndSalaryForEmployedMember', false],
    // ['copyOfOmangForEachGroupMember', false],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', false],
    // ['spouseMarriedId', false],
    // ['quotationForItemToFinanced', false],
    // ['proofOfPastBusinessActivity', false],
    // ['bankAccountConfirmationLetter', false],

    // ['addDocs', true],
  ]);

  private static agriBusinessIndividualRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: false, mandatory: false }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: false, mandatory: false }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: true, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: false }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: true, mandatory: false }],
    ['livestockCensus', { required: true, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: true, mandatory: false }],
    ['boreholeDrillingCompletion', { required: true, mandatory: false }],
    ['mapOfExistingBoreHole', { required: true, mandatory: false }],
    ['consentFromLandBoard', { required: true, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: true, mandatory: false }],
    ['ranchEcologySite', { required: true, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: false }],
    ['proofOfOwnership', { required: true, mandatory: false }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],

    // // For Groups Only
    // ['proofOfPhysicalAddress', false],
    // ['creditWorthinessReport', false],
    // ['groupBankAccountOpeningConfirmationLetter', false],
    // ['groupBankAccountStatement', false],
    // ['signedGroupConstitution', false],
    // ['groupMustHaveFiveToFifteenMember', false],
    // ['groupMemberMustResideWithingTwentyKm', false],
    // ['groupStartUpsRatio', false],
    // ['employedMemberIncome', false],
    // ['proofOfEmploymentAndSalaryForEmployedMember', false],
    // ['copyOfOmangForEachGroupMember', false],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', false],
    // ['spouseMarriedId', false],
    // ['quotationForItemToFinanced', false],
    // ['proofOfPastBusinessActivity', false],
    // ['bankAccountConfirmationLetter', false],

    // ['addDocs', true],
  ]);

  private static manufacturingCompanyGroupRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: true, mandatory: true }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: true, mandatory: true }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: true, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: false }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: true, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: true, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: false }],
    ['proofOfOwnership', { required: true, mandatory: false }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // For Groups Only
    ['proofOfPhysicalAddress', { required: false, mandatory: false }],
    ['creditWorthinessReport', { required: false, mandatory: false }],
    ['groupBankAccountOpeningConfirmationLetter', { required: false, mandatory: false }],
    ['groupBankAccountStatement', { required: false, mandatory: false }],
    ['signedGroupConstitution', { required: false, mandatory: false }],
    ['groupMustHaveFiveToFifteenMember', { required: false, mandatory: false }],
    ['groupMemberMustResideWithingTwentyKm', { required: false, mandatory: false }],
    ['groupStartUpsRatio', { required: false, mandatory: false }],
    ['employedMemberIncome', { required: false, mandatory: false }],
    ['proofOfEmploymentAndSalaryForEmployedMember', { required: false, mandatory: false }],
    ['copyOfOmangForEachGroupMember', { required: false, mandatory: false }],

    // For Mabogo Dinku Only
    ['completedApplicationForm', { required: false, mandatory: false }],
    ['spouseMarriedId', { required: false, mandatory: false }],
    ['quotationForItemToFinanced', { required: false, mandatory: false }],
    ['proofOfPastBusinessActivity', { required: false, mandatory: false }],
    ['bankAccountConfirmationLetter', { required: false, mandatory: false }],
  ]);

  private static manufacturingIndividualRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: false, mandatory: false }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: false, mandatory: false }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: true, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: false }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: true, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: true, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: false }],
    ['proofOfOwnership', { required: true, mandatory: false }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // // For Groups Only
    // ['proofOfPhysicalAddress', false],
    // ['creditWorthinessReport', false],
    // ['groupBankAccountOpeningConfirmationLetter', false],
    // ['groupBankAccountStatement', false],
    // ['signedGroupConstitution', false],
    // ['groupMustHaveFiveToFifteenMember', false],
    // ['groupMemberMustResideWithingTwentyKm', false],
    // ['groupStartUpsRatio', false],
    // ['employedMemberIncome', false],
    // ['proofOfEmploymentAndSalaryForEmployedMember', false],
    // ['copyOfOmangForEachGroupMember', false],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', false],
    // ['spouseMarriedId', false],
    // ['quotationForItemToFinanced', false],
    // ['proofOfPastBusinessActivity', false],
    // ['bankAccountConfirmationLetter', false],

    // ['addDocs', true],
  ]);

  private static propertyCompanyGroupRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: true, mandatory: true }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: true, mandatory: true }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: true, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: true }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: true, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: true, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: true }],
    ['proofOfOwnership', { required: true, mandatory: true }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // // For Groups Only
    // ['proofOfPhysicalAddress', {required: false, mandatory: false}],
    // ['creditWorthinessReport', {required: false, mandatory: false}],
    // ['groupBankAccountOpeningConfirmationLetter', {required: false, mandatory: false}],
    // ['groupBankAccountStatement', {required: false, mandatory: false}],
    // ['signedGroupConstitution', {required: false, mandatory: false}],
    // ['groupMustHaveFiveToFifteenMember', {required: false, mandatory: false}],
    // ['groupMemberMustResideWithingTwentyKm', {required: false, mandatory: false}],
    // ['groupStartUpsRatio', {required: false, mandatory: false}],
    // ['employedMemberIncome', {required: false, mandatory: false}],
    // ['proofOfEmploymentAndSalaryForEmployedMember', {required: false, mandatory: false}],
    // ['copyOfOmangForEachGroupMember', {required: false, mandatory: false}],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', {required: false, mandatory: false}],
    // ['spouseMarriedId', {required: false, mandatory: false}],
    // ['quotationForItemToFinanced', {required: false, mandatory: false}],
    // ['proofOfPastBusinessActivity', {required: false, mandatory: false}],
    // ['bankAccountConfirmationLetter', {required: false, mandatory: false}],
    //
  ]);

  private static propertyIndividualRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: false, mandatory: false }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: false, mandatory: false }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: false, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: true }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: true, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: true, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: true }],
    ['proofOfOwnership', { required: true, mandatory: true }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // For Groups Only
    // ['proofOfPhysicalAddress', {required: false, mandatory: false}],
    // ['creditWorthinessReport', {required: false, mandatory: false}],
    // ['groupBankAccountOpeningConfirmationLetter', {required: false, mandatory: false}],
    // ['groupBankAccountStatement', {required: false, mandatory: false}],
    // ['signedGroupConstitution', {required: false, mandatory: false}],
    // ['groupMustHaveFiveToFifteenMember', {required: false, mandatory: false}],
    // ['groupMemberMustResideWithingTwentyKm', {required: false, mandatory: false}],
    // ['groupStartUpsRatio', {required: false, mandatory: false}],
    // ['employedMemberIncome', {required: false, mandatory: false}],
    // ['proofOfEmploymentAndSalaryForEmployedMember', {required: false, mandatory: false}],
    // ['copyOfOmangForEachGroupMember', {required: false, mandatory: false}],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', {required: false, mandatory: false}],
    // ['spouseMarriedId', {required: false, mandatory: false}],
    // ['quotationForItemToFinanced', {required: false, mandatory: false}],
    // ['proofOfPastBusinessActivity', {required: false, mandatory: false}],
    // ['bankAccountConfirmationLetter', {required: false, mandatory: false}],
    //
  ]);

  private static servicesCompanyGroupRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: true, mandatory: true }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: true, mandatory: true }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: true, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: false }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: false, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: false, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: false }],
    ['proofOfOwnership', { required: true, mandatory: false }],
    ['franchiseeAgreement', { required: true, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // // For Groups Only
    // ['proofOfPhysicalAddress', {required: false, mandatory: false}],
    // ['creditWorthinessReport', {required: false, mandatory: false}],
    // ['groupBankAccountOpeningConfirmationLetter', {required: false, mandatory: false}],
    // ['groupBankAccountStatement', {required: false, mandatory: false}],
    // ['signedGroupConstitution', {required: false, mandatory: false}],
    // ['groupMustHaveFiveToFifteenMember', {required: false, mandatory: false}],
    // ['groupMemberMustResideWithingTwentyKm', {required: false, mandatory: false}],
    // ['groupStartUpsRatio', {required: false, mandatory: false}],
    // ['employedMemberIncome', {required: false, mandatory: false}],
    // ['proofOfEmploymentAndSalaryForEmployedMember', {required: false, mandatory: false}],
    // ['copyOfOmangForEachGroupMember', {required: false, mandatory: false}],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', {required: false, mandatory: false}],
    // ['spouseMarriedId', {required: false, mandatory: false}],
    // ['quotationForItemToFinanced', {required: false, mandatory: false}],
    // ['proofOfPastBusinessActivity', {required: false, mandatory: false}],
    // ['bankAccountConfirmationLetter', {required: false, mandatory: false}],
    //
  ]);

  private static servicesIndividualRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: true, mandatory: true }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: false, mandatory: false }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: false, mandatory: false }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: false, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: true, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: true, mandatory: true }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: true, mandatory: false }],
    ['deedOfSale', { required: true, mandatory: false }],
    ['proofOfTitleDeed', { required: true, mandatory: false }],
    ['billsOfQuantity', { required: true, mandatory: false }],
    ['structuralReport', { required: true, mandatory: false }],
    ['dueDilligenceReport', { required: true, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: true, mandatory: true }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: true, mandatory: true }],
    ['soilAndWaterTestsReport', { required: false, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: true, mandatory: true }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: true, mandatory: false }],
    ['deedsMarriageInstrument', { required: true, mandatory: false }],
    ['environmentImpactAssessment', { required: false, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: true, mandatory: false }],
    ['copyOfLeaseAgreement', { required: true, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: true, mandatory: false }],
    ['proofOfOwnership', { required: true, mandatory: false }],
    ['franchiseeAgreement', { required: true, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // // For Groups Only
    // ['proofOfPhysicalAddress', {required: false, mandatory: false}],
    // ['creditWorthinessReport', {required: false, mandatory: false}],
    // ['groupBankAccountOpeningConfirmationLetter', {required: false, mandatory: false}],
    // ['groupBankAccountStatement', {required: false, mandatory: false}],
    // ['signedGroupConstitution', {required: false, mandatory: false}],
    // ['groupMustHaveFiveToFifteenMember', {required: false, mandatory: false}],
    // ['groupMemberMustResideWithingTwentyKm', {required: false, mandatory: false}],
    // ['groupStartUpsRatio', {required: false, mandatory: false}],
    // ['employedMemberIncome', {required: false, mandatory: false}],
    // ['proofOfEmploymentAndSalaryForEmployedMember', {required: false, mandatory: false}],
    // ['copyOfOmangForEachGroupMember', {required: false, mandatory: false}],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', {required: false, mandatory: false}],
    // ['spouseMarriedId', {required: false, mandatory: false}],
    // ['quotationForItemToFinanced', {required: false, mandatory: false}],
    // ['proofOfPastBusinessActivity', {required: false, mandatory: false}],
    // ['bankAccountConfirmationLetter', {required: false, mandatory: false}],
    //
  ]);

  private static tradeFinanceCompanyGroupRequiredDocuement: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: false, mandatory: false }],
    ['companyProfile', { required: true, mandatory: true }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: true, mandatory: true }],
    ['letterOfRequest', { required: true, mandatory: true }],
    ['companyExtract', { required: true, mandatory: true }],
    ['incorporationCertificate', { required: true, mandatory: true }],
    ['auditedFinancialStatements', { required: false, mandatory: false }],
    ['historicFinancials', { required: true, mandatory: false }],
    ['personalBankStatementFor12Months', { required: false, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: false, mandatory: false }],
    ['financialProjections', { required: true, mandatory: true }],
    ['market', { required: true, mandatory: true }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: false, mandatory: false }],
    ['deedOfSale', { required: false, mandatory: false }],
    ['proofOfTitleDeed', { required: false, mandatory: false }],
    ['billsOfQuantity', { required: false, mandatory: false }],
    ['structuralReport', { required: false, mandatory: false }],
    ['dueDilligenceReport', { required: false, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: false, mandatory: false }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: false, mandatory: false }],
    ['soilAndWaterTestsReport', { required: false, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: false, mandatory: false }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: false, mandatory: false }],
    ['deedsMarriageInstrument', { required: false, mandatory: false }],
    ['environmentImpactAssessment', { required: false, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: false, mandatory: false }],
    ['copyOfLeaseAgreement', { required: false, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: false, mandatory: false }],
    ['proofOfOwnership', { required: false, mandatory: false }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // // For Groups Only
    // ['proofOfPhysicalAddress', {required: false, mandatory: false}],
    // ['creditWorthinessReport', {required: false, mandatory: false}],
    // ['groupBankAccountOpeningConfirmationLetter', {required: false, mandatory: false}],
    // ['groupBankAccountStatement', {required: false, mandatory: false}],
    // ['signedGroupConstitution', {required: false, mandatory: false}],
    // ['groupMustHaveFiveToFifteenMember', {required: false, mandatory: false}],
    // ['groupMemberMustResideWithingTwentyKm', {required: false, mandatory: false}],
    // ['groupStartUpsRatio', {required: false, mandatory: false}],
    // ['employedMemberIncome', {required: false, mandatory: false}],
    // ['proofOfEmploymentAndSalaryForEmployedMember', {required: false, mandatory: false}],
    // ['copyOfOmangForEachGroupMember', {required: false, mandatory: false}],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', {required: false, mandatory: false}],
    // ['spouseMarriedId', {required: false, mandatory: false}],
    // ['quotationForItemToFinanced', {required: false, mandatory: false}],
    // ['proofOfPastBusinessActivity', {required: false, mandatory: false}],
    // ['bankAccountConfirmationLetter', {required: false, mandatory: false}],
    //
  ]);

  private static tradeFinanceIndividualRequiredDocuement: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: false, mandatory: false }],
    ['companyProfile', { required: true, mandatory: true }],
    ['certifiedCopiesOfOmang', { required: true, mandatory: true }],
    ['resolutionByBod', { required: false, mandatory: false }],
    ['letterOfRequest', { required: true, mandatory: true }],
    ['companyExtract', { required: false, mandatory: false }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: false, mandatory: false }],
    ['historicFinancials', { required: true, mandatory: false }],
    ['personalBankStatementFor12Months', { required: false, mandatory: false }],
    ['businessBankStatementFor6months', { required: true, mandatory: false }],
    ['financialProjectionsFor5years', { required: false, mandatory: false }],
    ['financialProjections', { required: true, mandatory: true }],
    ['market', { required: true, mandatory: true }],
    ['personalBalanceSheetsOfAllShareholders', { required: true, mandatory: true }],
    ['valuationReport', { required: false, mandatory: false }],
    ['deedOfSale', { required: false, mandatory: false }],
    ['proofOfTitleDeed', { required: false, mandatory: false }],
    ['billsOfQuantity', { required: false, mandatory: false }],
    ['structuralReport', { required: false, mandatory: false }],
    ['dueDilligenceReport', { required: false, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: false, mandatory: false }],
    ['threeQuationsOfItems', { required: true, mandatory: true }],
    ['insuranceQuotations', { required: false, mandatory: false }],
    ['soilAndWaterTestsReport', { required: false, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: true, mandatory: true }],
    ['shareholderCertificates', { required: false, mandatory: false }],
    ['taxClearanceCertificate', { required: true, mandatory: false }],
    ['marriageCertificate', { required: false, mandatory: false }],
    ['deedsMarriageInstrument', { required: false, mandatory: false }],
    ['environmentImpactAssessment', { required: false, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: true, mandatory: true }],
    ['conceptOfArchitecturalApprovedPlans', { required: false, mandatory: false }],
    ['copyOfLeaseAgreement', { required: false, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: true, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: false, mandatory: false }],
    ['proofOfOwnership', { required: false, mandatory: false }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // // For Groups Only
    // ['proofOfPhysicalAddress', {required: false, mandatory: false}],
    // ['creditWorthinessReport', {required: false, mandatory: false}],
    // ['groupBankAccountOpeningConfirmationLetter', {required: false, mandatory: false}],
    // ['groupBankAccountStatement', {required: false, mandatory: false}],
    // ['signedGroupConstitution', {required: false, mandatory: false}],
    // ['groupMustHaveFiveToFifteenMember', {required: false, mandatory: false}],
    // ['groupMemberMustResideWithingTwentyKm', {required: false, mandatory: false}],
    // ['groupStartUpsRatio', {required: false, mandatory: false}],
    // ['employedMemberIncome', {required: false, mandatory: false}],
    // ['proofOfEmploymentAndSalaryForEmployedMember', {required: false, mandatory: false}],
    // ['copyOfOmangForEachGroupMember', {required: false, mandatory: false}],

    // // For Mabogo Dinku Only
    // ['completedApplicationForm', {required: false, mandatory: false}],
    // ['spouseMarriedId', {required: false, mandatory: false}],
    // ['quotationForItemToFinanced', {required: false, mandatory: false}],
    // ['proofOfPastBusinessActivity', {required: false, mandatory: false}],
    // ['bankAccountConfirmationLetter', {required: false, mandatory: false}],
    //
  ]);

  private static onlyForMobagoDinku: Map<string, { required: boolean; mandatory: boolean }> =
    new Map([
      ['applicationFormAndBusinessPlan', { required: false, mandatory: false }],
      ['companyProfile', { required: false, mandatory: false }],
      ['certifiedCopiesOfOmang', { required: false, mandatory: false }],
      ['resolutionByBod', { required: false, mandatory: false }],
      ['letterOfRequest', { required: false, mandatory: false }],
      ['companyExtract', { required: false, mandatory: false }],
      ['incorporationCertificate', { required: false, mandatory: false }],
      ['auditedFinancialStatements', { required: false, mandatory: false }],
      ['historicFinancials', { required: false, mandatory: false }],
      ['personalBankStatementFor12Months', { required: false, mandatory: false }],
      ['businessBankStatementFor6months', { required: false, mandatory: false }],
      ['financialProjectionsFor5years', { required: false, mandatory: false }],
      ['financialProjections', { required: false, mandatory: false }],
      ['market', { required: false, mandatory: false }],
      ['personalBalanceSheetsOfAllShareholders', { required: false, mandatory: false }],
      ['valuationReport', { required: false, mandatory: false }],
      ['deedOfSale', { required: false, mandatory: false }],
      ['proofOfTitleDeed', { required: false, mandatory: false }],
      ['billsOfQuantity', { required: false, mandatory: false }],
      ['structuralReport', { required: false, mandatory: false }],
      ['dueDilligenceReport', { required: false, mandatory: false }],
      ['livestockBrandCertificate', { required: false, mandatory: false }],
      ['livestockCensus', { required: false, mandatory: false }],
      ['letterOfIntent', { required: false, mandatory: false }],
      ['threeQuationsOfItems', { required: false, mandatory: false }],
      ['insuranceQuotations', { required: false, mandatory: false }],
      ['soilAndWaterTestsReport', { required: false, mandatory: false }],
      ['boreholeDrillingCompletion', { required: false, mandatory: false }],
      ['mapOfExistingBoreHole', { required: false, mandatory: false }],
      ['consentFromLandBoard', { required: false, mandatory: false }],
      ['cvOfShareHolders', { required: false, mandatory: false }],
      ['shareholderCertificates', { required: false, mandatory: false }],
      ['taxClearanceCertificate', { required: false, mandatory: false }],
      ['marriageCertificate', { required: false, mandatory: false }],
      ['deedsMarriageInstrument', { required: false, mandatory: false }],
      ['environmentImpactAssessment', { required: false, mandatory: false }],
      ['ranchEcologySite', { required: false, mandatory: false }],
      ['KYCForms', { required: false, mandatory: false }],
      ['conceptOfArchitecturalApprovedPlans', { required: false, mandatory: false }],
      ['copyOfLeaseAgreement', { required: false, mandatory: false }],
      ['copyOfNecessaryLicensesToOperate', { required: false, mandatory: false }],
      ['threeQuotationsForProposedDevelopment', { required: false, mandatory: false }],
      ['proofOfOwnership', { required: false, mandatory: false }],
      ['franchiseeAgreement', { required: false, mandatory: false }],
      ['addDocs', { required: false, mandatory: false }],
      ['disabilityDocument', { required: false, mandatory: false }],
      // For Groups Only
      ['proofOfPhysicalAddress', { required: false, mandatory: false }],
      ['creditWorthinessReport', { required: false, mandatory: false }],
      ['groupBankAccountOpeningConfirmationLetter', { required: false, mandatory: false }],
      ['groupBankAccountStatement', { required: false, mandatory: false }],
      ['signedGroupConstitution', { required: false, mandatory: false }],
      ['groupMustHaveFiveToFifteenMember', { required: false, mandatory: false }],
      ['groupMemberMustResideWithingTwentyKm', { required: false, mandatory: false }],
      ['groupStartUpsRatio', { required: false, mandatory: false }],
      ['employedMemberIncome', { required: false, mandatory: false }],
      ['proofOfEmploymentAndSalaryForEmployedMember', { required: false, mandatory: false }],

      // For Mabogo Dinku Only
      ['copyOfOmangForEachGroupMember', { required: true, mandatory: false }],
      ['completedApplicationForm', { required: true, mandatory: false }],
      ['spouseMarriedId', { required: true, mandatory: false }],
      ['quotationForItemToFinanced', { required: true, mandatory: false }],
      ['proofOfPastBusinessActivity', { required: true, mandatory: false }],
      ['bankAccountConfirmationLetter', { required: true, mandatory: false }],
    ]);

  private static onlyForGroupRequiredDocument: Map<
    string,
    { required: boolean; mandatory: boolean }
  > = new Map([
    ['applicationFormAndBusinessPlan', { required: false, mandatory: false }],
    ['companyProfile', { required: false, mandatory: false }],
    ['certifiedCopiesOfOmang', { required: false, mandatory: false }],
    ['resolutionByBod', { required: false, mandatory: false }],
    ['letterOfRequest', { required: false, mandatory: false }],
    ['companyExtract', { required: false, mandatory: false }],
    ['incorporationCertificate', { required: false, mandatory: false }],
    ['auditedFinancialStatements', { required: false, mandatory: false }],
    ['historicFinancials', { required: false, mandatory: false }],
    ['personalBankStatementFor12Months', { required: false, mandatory: false }],
    ['businessBankStatementFor6months', { required: false, mandatory: false }],
    ['financialProjectionsFor5years', { required: false, mandatory: false }],
    ['financialProjections', { required: false, mandatory: false }],
    ['market', { required: false, mandatory: false }],
    ['personalBalanceSheetsOfAllShareholders', { required: false, mandatory: false }],
    ['valuationReport', { required: false, mandatory: false }],
    ['deedOfSale', { required: false, mandatory: false }],
    ['proofOfTitleDeed', { required: false, mandatory: false }],
    ['billsOfQuantity', { required: false, mandatory: false }],
    ['structuralReport', { required: false, mandatory: false }],
    ['dueDilligenceReport', { required: false, mandatory: false }],
    ['livestockBrandCertificate', { required: false, mandatory: false }],
    ['livestockCensus', { required: false, mandatory: false }],
    ['letterOfIntent', { required: false, mandatory: false }],
    ['threeQuationsOfItems', { required: false, mandatory: false }],
    ['insuranceQuotations', { required: false, mandatory: false }],
    ['soilAndWaterTestsReport', { required: false, mandatory: false }],
    ['boreholeDrillingCompletion', { required: false, mandatory: false }],
    ['mapOfExistingBoreHole', { required: false, mandatory: false }],
    ['consentFromLandBoard', { required: false, mandatory: false }],
    ['cvOfShareHolders', { required: false, mandatory: false }],
    ['shareholderCertificates', { required: false, mandatory: false }],
    ['taxClearanceCertificate', { required: false, mandatory: false }],
    ['marriageCertificate', { required: false, mandatory: false }],
    ['deedsMarriageInstrument', { required: false, mandatory: false }],
    ['environmentImpactAssessment', { required: false, mandatory: false }],
    ['ranchEcologySite', { required: false, mandatory: false }],
    ['KYCForms', { required: false, mandatory: false }],
    ['conceptOfArchitecturalApprovedPlans', { required: false, mandatory: false }],
    ['copyOfLeaseAgreement', { required: false, mandatory: false }],
    ['copyOfNecessaryLicensesToOperate', { required: false, mandatory: false }],
    ['threeQuotationsForProposedDevelopment', { required: false, mandatory: false }],
    ['proofOfOwnership', { required: false, mandatory: false }],
    ['franchiseeAgreement', { required: false, mandatory: false }],
    ['addDocs', { required: false, mandatory: false }],
    ['disabilityDocument', { required: false, mandatory: false }],
    // For Groups Only
    ['proofOfPhysicalAddress', { required: true, mandatory: false }],
    ['creditWorthinessReport', { required: true, mandatory: false }],
    ['groupBankAccountOpeningConfirmationLetter', { required: true, mandatory: false }],
    ['groupBankAccountStatement', { required: true, mandatory: false }],
    ['signedGroupConstitution', { required: true, mandatory: false }],
    ['groupMustHaveFiveToFifteenMember', { required: true, mandatory: false }],
    ['groupMemberMustResideWithingTwentyKm', { required: true, mandatory: false }],
    ['groupStartUpsRatio', { required: true, mandatory: false }],
    ['employedMemberIncome', { required: true, mandatory: false }],
    ['proofOfEmploymentAndSalaryForEmployedMember', { required: true, mandatory: false }],

    // For Mabogo Dinku Only
    ['copyOfOmangForEachGroupMember', { required: false, mandatory: false }],
    ['completedApplicationForm', { required: false, mandatory: false }],
    ['spouseMarriedId', { required: false, mandatory: false }],
    ['quotationForItemToFinanced', { required: false, mandatory: false }],
    ['proofOfPastBusinessActivity', { required: false, mandatory: false }],
    ['bankAccountConfirmationLetter', { required: false, mandatory: false }],
  ]);
}
