import { DestroyRef, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class MabogoDinkuDocumentDetailsFormService {
  documentDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private destroyRef: DestroyRef) {
    this.initializeDocumentDetailsForm();
  }

  private initializeDocumentDetailsForm() {
    this.documentDetailsForm = this.fb.group(
      {
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
        KYCForms: [[], [Validators.required]], // KYCForms // todo: new property
        conceptOfArchitecturalApprovedPlans: [[]], // architecturalDrawings
        copyOfLeaseAgreement: [[]], // leaseAgreementCopy
        copyOfNecessaryLicensesToOperate: [[]], // licenseCopy
        threeQuotationsForProposedDevelopment: [[]], // developmentQuotations
        proofOfOwnership: [[]], // landOwnershipProof
        franchiseeAgreement: [[]], // franchiseAgreement
        addDocs: [[]], // addDocs

        disabilityDocument: [[]], // disabilityDocument
        cleanCreditCheckDocs: [[]],
        adverseCreditCheckDocs: [[]], // adversetypecreditcheckdocs

        // === Extra Field ==== // Fix it

        form2: [[]],
        form3: [[]],
        form4: [[]],
        form5: [[]],

        isCitizens: [[]],

        moaa: [[]],
        professionalAndAcadamicCertificates: [[]],

        proofOfResidence: [[]],
        provisionalOfferOfLand: [[]],

        usageOfLand: [[]],

        // Mabago Dinku Form
        // individual applicant and for every body
        completedApplicationForm: [[]],
        spouseMarriedId: [[]],
        quotationForItemToFinanced: [[]],
        proofOfPastBusinessActivity: [[]],
        bankAccountConfirmationLetter: [[]],
        // For Groups
        proofOfPhysicalAddress: [[]],
        creditWorthinessReport: [[]], // (ITC/Trans Union report)
        groupBankAccountOpeningConfirmationLetter: [[]],
        groupBankAccountStatement: [[]],
        signedGroupConstitution: [[]],
        groupMustHaveFiveToFifteenMember: [[]],
        groupMemberMustResideWithingTwentyKm: [[]],
        groupStartUpsRatio: [[]],
        employedMemberIncome: [[]],
        proofOfEmploymentAndSalaryForEmployedMember: [[]],
        copyOfOmangForEachGroupMember: [[]],
        fillStatus: [''],
      },
      { updateOn: 'change' },
    );
  }
}
