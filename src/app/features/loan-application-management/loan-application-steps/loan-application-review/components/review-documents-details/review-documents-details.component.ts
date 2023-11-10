import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NewLoanDocsModel } from '../../../document-details-form-updated/document-model';
import { ReadOnlyInputComponent } from '../read-only-input/read-only-input.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'review-documents-details',
  standalone: true,
  imports: [CommonModule, ReadOnlyInputComponent],
  templateUrl: './review-documents-details.component.html',
  styleUrls: ['./review-documents-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDocumentsDetailsComponent {
  @Input() loanDocs: NewLoanDocsModel;

  private loanDocsNameMap: Map<string, string> = new Map<string, string>();

  public getDocumentKeys() {
    if (this.loanDocs) {
      const keysOfLoanDocs = Object.keys(this.loanDocs) as (keyof NewLoanDocsModel)[];
      this.loanDocsNameMap = this.generateMapFromKeys<NewLoanDocsModel>(keysOfLoanDocs);
      return keysOfLoanDocs;
    }

    this.loanDocsNameMap = new Map<string, string>();
    return [];
  }

  public getLoanDocumentName(controlName: string) {
    return this.loanDocsNameMap.get(controlName);

    // const documentNames = {
    //     certifiedCopiesOfOmang: 'Omang',
    //     threeQuationsOfItems: 'Quotations',
    //     consentFromLandBoard: 'Consent',
    //     letterOfRequest: 'Request Letter',
    //     financialProjectionsFor5years: '5-year Projections',
    //     boreholeDrillingCompletion: 'Borehole Completion',
    //     cvOfShareHolders: 'CVs of Shareholders',
    //     ranchEcologySite: 'Ranch Site',
    //     usageOfLand: 'Land Usage',
    //     mapOfExistingBoreHole: 'Borehole Map',
    //     livestockBrandCertificate: 'Brand Certificate',
    //     personalBalanceSheetsOfAllShareholders: 'Balance Sheets',
    //     businessBankStatementFor6months: 'Bank Statements',
    //     copyOfNecessaryLicensesToOperate: 'Licenses',
    //     form5: 'Form 5',
    //     proofOfResidence: 'Proof of Residence',
    //     form4: 'Form 4',
    //     provisionalOfferOfLand: 'Offer of Land',
    //     market: 'Market Info',
    //     franchiseeAgreement: 'Franchise Agreement',
    //     deedsMarriageInstrument: 'Marriage Instrument',
    //     copyOfLeaseAgreement: 'Lease Agreement',
    //     leaseAgreement: 'Lease Agreement',
    //     applicationFormAndBusinessPlan: 'Application Form ',
    //     deedOfSale: 'Deed of Sale',
    //     form3: 'Form 3',
    //     form2: 'Form 2',
    //     taxClearanceCertificate: 'Tax  Certificate',
    //     financialProjections: 'Financial Projections',
    //     livestockCensus: 'Livestock Census',
    //     environmentImpactAssessment: 'Environmental ',
    //     proofOfOwnership: 'Proof of Ownership',
    //     personalBankStatementFor12Months: 'Personal BS',
    //     companyProfile: 'Company Profile',
    //     proofOfTitleDeed: 'Proof of Title Deed',
    //     professionalAndAcadamicCertificates: 'Professional Certificates',
    //     threeQuotationsForProposedDevelopment: 'Quotations Development',
    //     dueDilligenceReport: 'Due Diligence Report',
    //     marriageCertificate: 'Marriage Certificate',
    //     soilAndWaterTestsReport: 'Soil and Water Tests Report',
    //     structuralReport: 'Structural Report',
    //     conceptOfArchitecturalApprovedPlans: 'Approved Plans',
    //     valuationReport: 'Valuation Report',
    //     resolutionByBod: 'Resolution Directors',
    //     moaa: 'Memorandum Association',
    //     billsOfQuantity: 'Bills of Quantity',
    //     approvedArchitecturalDrawings: 'Approved  Drawings',
    //     insuranceQuotations: 'Insurance Quotations',
    //     historicFinancials: 'Historic Financial Statements',
    //     isCitizens: 'Citizenship Status',
    //     letterOfIntent: 'Letter of Intent',
    //     auditedFinancialStatements: 'Audited  Statements',
    //     addDoc1: 'Additional Document 1',
    //     addDoc2: 'Additional Document 2',
    //     addDoc3: 'Additional Document 3',
    //     addDoc4: 'Additional Document 4',
    //     addDoc5: 'Additional Document 5',
    //     addDoc6: 'Additional Document 6',
    //     addDoc7: 'Additional Document 7',
    //     addDoc8: 'Additional Document 8',
    //     addDoc9: 'Additional Document 9',
    //     addDoc10: 'Additional Document 10',
    //     additionalDocument: 'Additional Document',
    //     addDocs: 'Additional Document',
    //
    //     // added for mabago dinku application document
    //     completedApplicationForm: 'Completed Application Form',
    //     spouseMarriedId: 'Spouse Id (if married)',
    //     quotationForItemToFinanced: 'Quotation of items to be financed',
    //     proofOfPastBusinessActivity: 'Proof of past business activity',
    //     bankAccountConfirmationLetter: 'Bank account confirmation letter',
    //     // For Groups
    //     proofOfPhysicalAddress: 'Proof of physical address',
    //     creditWorthinessReport: 'Credit Worthiness Report', // (ITC/Trans Union report)
    //     groupBankAccountOpeningConfirmationLetter: 'Group Account Opening Confirmation Letter',
    //     groupBankAccountStatement: 'Group Bank Statements',
    //     signedGroupConstitution: 'Signed Group Constitution',
    //     groupMustHaveFiveToFifteenMember: 'Proof Of Must Have Five to Fifteen Member',
    //     groupMemberMustResideWithingTwentyKm: 'Group Residence Address ( Within 20Km) ',
    //     groupStartUpsRatio: 'Group Startup Ratio',
    //     employedMemberIncome: 'Employed Member Income',
    //     proofOfEmploymentAndSalaryForEmployedMember: 'Proof Of Emplyment And Salary',
    //     copyOfOmangForEachGroupMember: 'Copy Of Omang For Group',
    // };
    // //@ts-ignore
    // return documentNames[controlName];
  }

  public getDocumentValue(key: string): string[] {
    if (this.loanDocs) {
      // @ts-ignore
      const value = this.loanDocs[key];

      // if value is type of array
      if (Array.isArray(value)) {
        return value.map(item => item.docName);
      } else if (value) {
        if (value.hasOwnProperty('docName')) {
          return [value['docName']];
        } else {
          return ['Not Applicable'];
        }
      } else {
        return ['Not Applicable'];
      }
    }

    return ['Not Applicable'];
  }

  // ============ Helper ==================
  private generateMapFromInterface<T>(interfaceObj: T): Map<keyof T, string> {
    function toTitleCase(str: string): string {
      return str.replace(/([A-Z])/g, ' $1').trim();
    }

    const generatedMap = new Map<keyof T, string>();

    for (const key in interfaceObj) {
      // @ts-ignore
      if (interfaceObj.hasOwnProperty(key)) {
        generatedMap.set(key, toTitleCase(key));
      }
    }

    return generatedMap;
  }

  private generateMapFromKeys<T>(keys: (keyof T)[]): Map<keyof T, string> {
    function toTitleCase(str: string): string {
      return str
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    const generatedMap = new Map<keyof T, string>();

    for (const key of keys) {
      generatedMap.set(key, toTitleCase(key as string));
    }

    return generatedMap;
  }
}
