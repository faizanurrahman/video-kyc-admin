/* eslint-disable max-len */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

//by importing
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';

import { ActivatedRoute } from '@angular/router';
import { HttpLoaderService } from '@core/services/http-loader.service';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { LoanApplicationService } from '../../services/loan-application.service';
// import {LoanApplicationDocumentModel}  from '../models/document-model';
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationType,
} from '../../models/loan-application.enum';
import { LoanApplicationStateService } from '../../services/loan-application-state.service';
import { IndividualCountService } from '../individual-form/individual-count.service';
import { DocumentUploadControlData } from './file-upload.model';
import { FileUploaderV2Component } from './file-uploader-v2/file-uploader-v2.component';
import {
  LoanApplicationDocumentUtils,
  LoanApplicationRequiredDocumentModel,
} from './latest-document-details-helper.utils';

// Define a new type called LoanApplicationSectorType, which can only have one of four possible string values.
declare var require: any;

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ClickableDirective } from '../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { LoanApplicationRequiredFieldService } from '../../state-management/loan-application-required-field-management.service';
import { InvoiceProps } from './document-model';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-document-details-form-updated',
  templateUrl: './document-details-form-updated.component.html',
  styleUrls: ['./document-details-form-updated.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgbTooltip,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgClass,
    NgStyle,
    FileUploaderV2Component,
    AsyncPipe,
    ClickableDirective,
  ],
})
export class DocumentDetailsFormUpdatedComponent implements OnInit, OnDestroy {
  public applicantHasDisability: boolean = false;
  public hasCreditCheckDocuemnt: boolean = false;
  public creditCheckType: 'clean' | 'adverse' | null = null;
  // Public Output Events
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onSubmitApplication: any = new EventEmitter<any>();

  @Output()
  public nextStepMove: any = new EventEmitter<any>();
  @Output()
  public previousStepMove: any = new EventEmitter<any>();

  @Output()
  public documentFormValidityAndProgress: any = new EventEmitter<{
    validity: boolean;
    progress: number;
  }>();

  // Public Input
  @Input() currentLoanDocumentResponse: any;

  public loanDocumentDetailsForm: FormGroup;
  public currentLoanDocumentDetails: any;

  // Current Application Details
  public applicationId: string;

  public isApplicationDisabled: boolean = false;

  // UI State Loader
  public loading$: any;

  // Show / Hide instruction
  public instructionHidden: boolean = false;

  // Handle Subscription

  //===================== Private Attributes ================

  // ==================== Public Attributes =====================
  public loanApplicationSector: LoanApplicationSectorType;
  public loanType: LoanApplicationType;
  public currentApplicationId: string;
  public loanApplicationProductType: LoanApplicationProductType;
  public loanApplicationStatus: string;
  public currentStep: number;
  public requiredDocuments: LoanApplicationRequiredDocumentModel[] = [];

  constructor(
    private fb: FormBuilder,
    public loader: HttpLoaderService,
    private toastr: ToastrService,
    private loanApplicationStatusService: LoanApplicationStateService,
    private activatedRoute: ActivatedRoute,
    private loanApplicationService: LoanApplicationService,
    private destroyRef: DestroyRef,
    private individualCountService: IndividualCountService,
    private loanApplicationRequiredFiled: LoanApplicationRequiredFieldService,
  ) {
    this.loading$ = this.loader.loading$;

    // Getting application id details
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get('applicationId')!;
    // console.log('Constructor in Document Details UPdated');
  }

  private updateFormValidator() {
    this.requiredDocuments.forEach((item: LoanApplicationRequiredDocumentModel, index: number) => {
      if (item.isMandatory) {
        this.loanDocumentDetailsForm.get(item.controlName)?.setValidators(Validators.required);
      } else {
        this.loanDocumentDetailsForm.get(item.controlName)?.clearValidators();
      }

      // this.loanDocumentDetailsForm.get(item.controlName)?.addValidators(Validators.required);
    });
    this.loanDocumentDetailsForm.updateValueAndValidity();
  }

  ngOnInit() {
    // Initialize loan Document Details
    this.initializeLoanDocumentForm();

    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((routeRes: any) => {
          this.loanType = routeRes['loanType'];
          this.currentApplicationId = routeRes['applicationId'];
          this.loanApplicationSector = routeRes['sectorType'];
          this.loanApplicationProductType = routeRes['productType'];
          this.loanApplicationStatus = routeRes['loanApplicationStatus'];
          this.currentStep = routeRes['currentStep'];

          //
          return of(true);
        }),

        switchMap((res: any) => {
          return this.loanApplicationService
            .getLoanApplicationDetails(this.applicationId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        switchMap((res: any) => {
          // checking if any applicant has disability
          const individualDetails = res.data.appDetails.loanIndividualDetails || [];
          const numberOfIndividual = individualDetails.length;
          individualDetails.forEach((individualData: any) => {
            if (individualData.disability) {
              this.applicantHasDisability = true;
            }

            if (individualData.creditCheck) {
              this.hasCreditCheckDocuemnt = true;
              if (individualData.creditCheck === 'clean') {
                this.creditCheckType = 'clean';
              } else if (individualData.creditCheck === 'adverse') {
                this.creditCheckType = 'adverse';
              }
            }
          });
          // console.log('RES----------------', res);
          const loanDocs = res.data.appDetails.loanDocs;

          this.requiredDocuments = LoanApplicationDocumentUtils.getRequiredDocuments(
            this.loanApplicationSector,
            this.loanType,
            this.loanApplicationProductType,
          );
          this.requiredDocuments = this.requiredDocuments.filter(
            (item: LoanApplicationRequiredDocumentModel) => {
              return item.isRequired && item.numberOfDocument !== 0;
            },
          );

          // Letlhabile applications attachments on Financial Projections should not be mandatory as it’s not a requirement
          if (this.loanApplicationProductType === 'letlhabile') {
            this.requiredDocuments = this.requiredDocuments.map(
              (item: LoanApplicationRequiredDocumentModel) => {
                if (
                  item.controlName === 'financialProjectionsFor5years' ||
                  item.controlName === 'financialProjections'
                ) {
                  item.isMandatory = false;
                }
                return item;
              },
            );
          }

          // If individual count is greater than 1 then set document count whenever it is -1;
          this.requiredDocuments = this.requiredDocuments.map(
            (item: LoanApplicationRequiredDocumentModel) => {
              if (item.numberOfDocument === -1) {
                item.numberOfDocument = numberOfIndividual;
                item.longDescription =
                  item.longDescription +
                  ' Note: For group loan applications, please ensure to include the relevant documents for each individual in the group.';
              }
              return item;
            },
          );

          // add additonal document again
          this.requiredDocuments.push({
            controlName: 'addDocs',
            numberOfDocument: 10,
            isRequired: true,
            longDescription:
              'Upload any additional relevant documents to support your loan application, such as proof of collateral, financial statements, project plans, contracts, or any other supporting documentation. Providing comprehensive and accurate additional documents can expedite the loan review process and increase your approval chances. Ensure that all uploaded documents are clear and legible.',
            documentName: 'Additional Document',
            documentSize: 100,
            extension: '.pdf,.png.jpeg,.jpg',
            isMultiple: true,
            labelName: 'Additional Document',
            isMandatory: false,
            isOptional: true,
          });

          // If Disability Exist
          if (this.applicantHasDisability) {
            this.requiredDocuments.push({
              controlName: 'disabilityDocument',
              numberOfDocument: 100,
              isRequired: true,
              longDescription:
                'Upload any additional relevant documents to support your disability.',
              documentName: 'Disability Document',
              documentSize: 100,
              extension: '.pdf,.png,.jpeg,.jpg',
              isMultiple: true,
              labelName: 'Disability Document',
              isMandatory: true,
              isOptional: false,
            });
          }

          // If has credit check
          // todo;
          if (this.hasCreditCheckDocuemnt) {
            if (this.creditCheckType === 'clean') {
              this.requiredDocuments.push({
                controlName: 'cleanCreditCheckDocs',
                numberOfDocument: 100,
                isRequired: true,
                longDescription: '',
                documentName: 'Clean ITC Credit Check Document',
                documentSize: 100,
                extension: '.pdf,.png,.jpeg,.jpg',
                isMultiple: true,
                labelName: 'Credit Check',
                isMandatory: true,
                isOptional: false,
              });
            } else if (this.creditCheckType === 'adverse') {
              this.requiredDocuments.push({
                controlName: 'adverseCreditCheckDocs',
                numberOfDocument: 100,
                isRequired: true,
                longDescription: '',
                documentName: 'Adverse ITC Credit Check Document',
                documentSize: 100,
                extension: '.pdf,.png,.jpeg,.jpg',
                isMultiple: true,
                labelName: 'Credit Check',
                isMandatory: true,
                isOptional: false,
              });
            }
          }

          this.loanDocumentDetailsForm.patchValue(loanDocs);
          this.updateFormValidator();

          return this.loanApplicationStatusService.currentLoanStatus$.pipe(
            takeUntilDestroyed(this.destroyRef),
            distinctUntilChanged(),
          );
        }),
      )
      .subscribe((response: any) => {
        if (
          response === 'SUBMITTED' ||
          response === 'APPROVED' ||
          response === 'ACCEPTED' ||
          response === 'REJECTED'
        ) {
          this.loanDocumentDetailsForm.disable();
          this.isApplicationDisabled = true;
        } else {
          // this.loanDocumentDetailsForm.enable();
          this.isApplicationDisabled = false;

          // show guidline
          this.showGuidelines();
        }

        // console.log('%cNow Required Document Is: ', 'font-size: 33px', this.requiredDocuments);
      });
  }

  ngOnDestroy() {}

  // Public Methods
  initializeLoanDocumentForm() {
    // Initialize raw reactive form
    this.loanDocumentDetailsForm = this.fb.group({
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
    });

    // update form from parent input
    if (this.currentLoanDocumentResponse === undefined) {
      this.currentLoanDocumentResponse = {};
      Object.keys(this.loanDocumentDetailsForm.controls).forEach((controlName: string) => {
        // this.currentLoanDocumentResponse[controlName] = [];
      });
    }

    // subscribe to changes of status of form
    this.loanDocumentDetailsForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: any) => {
        const progress = this.calculateProgress();
        this.documentFormValidityAndProgress.emit({
          validity: this.loanDocumentDetailsForm.valid,
          progress: progress,
        });
      });
  }

  // On File Uploaded Successfully
  public documentUploadedSuccessfully(eventResponse: any, controlName: string) {
    // this.loanDocumentDetailsForm.get(controlName)?.setValue(eventResponse);

    // console.log('documentUploadsuccessfull called');

    let currentValueOfControl = this.loanDocumentDetailsForm.get(controlName)?.value;

    if (Array.isArray(currentValueOfControl)) {
      currentValueOfControl.push(eventResponse);
    } else {
      currentValueOfControl = eventResponse;
    }

    this.loanDocumentDetailsForm.get(controlName)?.setValue(currentValueOfControl);
  }

  // On File Removed Successfully
  public fileRemoved(eventResponse: any, controlName: string) {
    let currentValueOfControl = this.loanDocumentDetailsForm.get(controlName)?.value;
    if (Array.isArray(currentValueOfControl)) {
      currentValueOfControl.splice(currentValueOfControl.indexOf(eventResponse));
    } else {
      currentValueOfControl = '';
    }

    this.loanDocumentDetailsForm.get(controlName)?.setValue(currentValueOfControl);
  }

  // ----- Multistep Form Navigation -----
  protected async previousStep() {
    setTimeout(() => {
      this.previousStepMove.emit(true);
    }, 1000);
  }

  protected async nextStep() {
    if (this.isApplicationDisabled) {
      this.nextStepMove.emit(true);
      this.documentFormValidityAndProgress.emit({
        validity: this.loanDocumentDetailsForm.valid,
        progress: 100,
      });
      return;
    }

    const isSaved = await this.saveApplication();
    console.log('saved applicaiton: ', isSaved);
    if (isSaved) {
      this.nextStepMove.emit(true);
    } else {
      this.nextStepMove.emit(true);
      return;
    }
  }

  async saveApplication() {
    // this.toastr.success('Saved Successfully!', 'Application');
    const result = await this.showRequiredFields();
    return result;
  }

  // -------   HELPER FUNCTION   ------------

  calculateProgress(): number {
    const totalRequiredSteps = Object.keys(this.loanDocumentDetailsForm.controls).filter(
      (controlName) => {
        const control = this.loanDocumentDetailsForm.controls[controlName];
        return (
          control.validator &&
          control.validator({} as AbstractControl) &&
          control.validator({} as AbstractControl)!.required
        );
      },
    ).length;

    const completedRequiredSteps = Object.keys(this.loanDocumentDetailsForm.controls).filter(
      (controlName) => {
        const control = this.loanDocumentDetailsForm.controls[controlName];
        return (
          control.valid &&
          control.validator &&
          control.validator({} as AbstractControl) &&
          control.validator({} as AbstractControl)!.required
        );
      },
    ).length;

    return (completedRequiredSteps / totalRequiredSteps) * 100;
  }

  public getDocumentData(doc: LoanApplicationRequiredDocumentModel) {
    const controlName = doc.controlName;
    const currentControlValue = this.loanDocumentDetailsForm.get(controlName)?.value;
    const isRequired = doc.isRequired;
    const maxSize = 1024 * 1024 * doc.documentSize; // 10MB
    const minSize = 100; // 10 byte
    const isMultiple = Array.isArray(currentControlValue) ? true : false;
    const formControlName = controlName;
    const maxFileCount = doc.numberOfDocument;

    const accept = doc.extension;
    const data = currentControlValue;

    const documentData = {
      name: doc.labelName,
      formControlName: formControlName,
      required: isRequired,
      accept: accept,
      data: data,
      maxFileCount: maxFileCount,
      maxSize: maxSize,
      minSize: minSize,
      multiple: isMultiple,
      type: '',
      longDescription: doc.longDescription,
    } as DocumentUploadControlData;

    return documentData;
  }

  public getDocumentFormControlNames() {
    return Object.keys(this.loanDocumentDetailsForm.controls);
  }

  public getDocumentValidation(controlName: string, type = 'required') {
    return this.loanDocumentDetailsForm
      .get(controlName)
      ?.hasValidator(Validators.required)
      .valueOf();
  }

  public getDocumentName(controlName: string) {
    const documentNames = {
      certifiedCopiesOfOmang: 'Certified Copies of Omang',
      threeQuationsOfItems: 'Three Quotations of Items',
      consentFromLandBoard: 'Consent from Land Board',
      letterOfRequest: 'Letter of Request',
      financialProjectionsFor5years: '5-Year Financial Projections',
      boreholeDrillingCompletion: 'Borehole Drilling Completion',
      cvOfShareHolders: 'CVs of Shareholders',
      ranchEcologySite: 'Ranch Ecology Site',
      usageOfLand: 'Land Usage',
      mapOfExistingBoreHole: 'Map of Existing Borehole',
      livestockBrandCertificate: 'Livestock Brand Certificate',
      personalBalanceSheetsOfAllShareholders: 'Personal Balance Sheets of all Shareholders',
      businessBankStatementFor6months: 'Business Bank Statement for 6 Months',
      copyOfNecessaryLicensesToOperate: 'Copy of Necessary Licenses to Operate',
      form5: 'Form 5',
      proofOfResidence: 'Proof of Residence',
      form4: 'Form 4',
      provisionalOfferOfLand: 'Provisional Offer of Land',
      market: 'Market Information',
      franchiseeAgreement: 'Franchisee Agreement',
      deedsMarriageInstrument: 'Deeds of Marriage Instrument',
      copyOfLeaseAgreement: 'Copy of Lease Agreement',
      leaseAgreement: 'Lease Agreement',
      applicationFormAndBusinessPlan: 'Application Form and Business Plan',
      deedOfSale: 'Deed of Sale',
      form3: 'Form 3',
      form2: 'Form 2',
      taxClearanceCertificate: 'Tax Clearance Certificate',
      financialProjections: 'Financial Projections',
      livestockCensus: 'Livestock Census',
      environmentImpactAssessment: 'Environmental Impact Assessment',
      proofOfOwnership: 'Proof of Ownership',
      personalBankStatementFor12Months: 'Personal Bank Statement for 12 Months',
      companyProfile: 'Company Profile',
      proofOfTitleDeed: 'Proof of Title Deed',
      professionalAndAcadamicCertificates: 'Professional and Academic Certificates',
      threeQuotationsForProposedDevelopment: 'Three Quotations for Proposed Development',
      dueDilligenceReport: 'Due Diligence Report',
      marriageCertificate: 'Marriage Certificate',
      soilAndWaterTestsReport: 'Soil and Water Tests Report',
      structuralReport: 'Structural Report',
      conceptOfArchitecturalApprovedPlans: 'Concept of Approved Architectural Plans',
      valuationReport: 'Valuation Report',
      resolutionByBod: 'Resolution by Board of Directors',
      moaa: 'Memorandum and Articles of Association',
      billsOfQuantity: 'Bills of Quantity',
      approvedArchitecturalDrawings: 'Approved Architectural Drawings',
      insuranceQuotations: 'Insurance Quotations',
      historicFinancials: 'Historic Financial Statements',
      isCitizens: 'Citizenship Status',
      letterOfIntent: 'Letter of Intent',
      auditedFinancialStatements: 'Audited Financial Statements',
      addDoc1: 'Additional Document 1',
      addDoc2: 'Additional Document 2',
      addDoc3: 'Additional Document 3',
      addDoc4: 'Additional Document 4',
      addDoc5: 'Additional Document 5',
      addDoc6: 'Additional Document 6',
      addDoc7: 'Additional Document 7',
      addDoc8: 'Additional Document 8',
      addDoc9: 'Additional Document 9',
      addDoc10: 'Additional Document 10',
      addDocs: 'Additional Document',
      // added for mabago dinku application document
      completedApplicationForm: 'Completed Application Form',
      spouseMarriedId: 'Spouse Id (if married)',
      quotationForItemToFinanced: 'Quotation of items to be financed',
      proofOfPastBusinessActivity: 'Proof of past business activity',
      bankAccountConfirmationLetter: 'Bank account confirmation letter',
      // For Groups
      proofOfPhysicalAddress: 'Proof of physical address',
      creditWorthinessReport: 'Credit Worthiness Report', // (ITC/Trans Union report)
      groupBankAccountOpeningConfirmationLetter: 'Group Account Opening Confirmation Letter',
      groupBankAccountStatement: 'Group Bank Statements',
      signedGroupConstitution: 'Signed Group Constitution',
      groupMustHaveFiveToFifteenMember: 'Proof Of Must Have Five to Fifteen Member',
      groupMemberMustResideWithingTwentyKm: 'Group Residence Address ( Within 20Km) ',
      groupStartUpsRatio: 'Group Startup Ratio',
      employedMemberIncome: 'Employed Member Income',
      proofOfEmploymentAndSalaryForEmployedMember: 'Proof Of Emplyment And Salary',
      copyOfOmangForEachGroupMember: 'Copy Of Omang For Group',
    };
    //@ts-ignore
    return documentNames[controlName];
  }

  public showGuidelines() {
    const items = this.requiredDocuments
      .filter((item) => {
        return item.isMandatory;
      })
      .map(({ labelName }) => `<li class="list-item text-start">${labelName}</li>`);

    Swal.fire({
      title: 'Guidelines for uploading documents',
      icon: 'info',
      html: `
      <div class="d-flex flex-column g-4">
        <div class="fs-4">
          Please make sure to follow and read the guidelines while uploading documents
        </div>
        <div class="fs-3 mt-3 mb-1 py-3 bg-light-primary">Document Required</div>
        <ul class="list">
          ${items.join('')}
        </ul>
      </div>
    `,
      customClass: {
        container: 'custom-container',
        popup: 'custom-popup',
        title: 'custom-title',
        confirmButton: 'custom-confirm-button',
        icon: 'custom-icon',
      },
      confirmButtonText: 'Continue',
      width: 'clamp(350px, 80vw, 600px)',
      heightAuto: false,
    });
  }

  public initMabagoDinkuDocuments() {
    return [
      {
        labelName: 'Completed Application Form',
        controlName: 'completedApplicationForm',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: true,
      },
      {
        labelName: 'Spouse Married ID',
        controlName: 'spouseMarriedId',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Quotation for Item to be Financed',
        controlName: 'quotationForItemToFinanced',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Proof of past Business Activity',
        controlName: 'proofOfPastBusinessActivity',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Bank Account Confirmation Letter',
        controlName: 'bankAccountConfirmationLetter',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Proof of Physical Address',
        controlName: 'proofOfPhysicalAddress',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Credit Worthiness Report (ITC/Trans Union report)',
        controlName: 'creditWorthinessReport',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Group Bank Account Opening Confirmation Letter',
        controlName: 'groupBankAccountOpeningConfirmationLetter',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Group Bank Account Statement',
        controlName: 'groupBankAccountStatement',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Signed Group Constitution',
        controlName: 'signedGroupConstitution',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Group must have 5 to 15 members',
        controlName: 'groupMustHaveFiveToFifteenMember',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Group Member Must Reside Within 20 Km',
        controlName: 'groupMemberMustResideWithingTwentyKm',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Ratio of employed members income (if applicable)',
        controlName: 'employedMemberIncome',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Proof of employment and Salary for employed member (if applicable)',
        controlName: 'proofOfEmploymentAndSalaryForEmployedMember',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
      {
        labelName: 'Copy of Omang for each group member',
        controlName: 'copyOfOmangForEachGroupMember',
        numberOfDocs: 1,
        maxUploadSize: 10,
        fileExtensionType: '.jpg,.jpeg,.png,.pdf',
        addInformation: '',
        required: false,
      },
    ];
  }

  public generateRequiredDocumentPdf() {
    Swal.fire({
      title: 'Export Required Documents',
      text: 'Are you sure you want to export the required documents?',
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      customClass: {
        title: 'custom-title',
        confirmButton: 'custom-confirm-button',
        icon: 'custom-icon',
      },
      confirmButtonText: 'Export',

      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const requiredDocumentsNames = this.requiredDocuments.map((doc) => {
          return doc.labelName.trim();
        });

        let fileName =
          this.loanApplicationSector + '-' + this.loanType + '-' + 'required-documents' + '.pdf';

        // pdfMake.createPdf(documentDefinition).download(fileName);

        var props: InvoiceProps = {
          outputType: OutputType.Save,
          returnJsPDFDocObject: true,
          fileName: fileName,
          orientationLandscape: false,
          compress: true,
          logo: {
            src: './assets/media/logos/ceda-logo-transparent.png',
            type: 'PNG', //optional, when src= data:uri (nodejs case)
            width: 53.33, //aspect ratio = width/height
            height: 20.66,
            margin: {
              top: 0, //negative or positive num, from the current position
              left: 0, //negative or positive num, from the current position
            },
          },
          stamp: {
            inAllPages: true, //by default = false, just in the last page
            src: './assets/media/logos/ceda-logo-mini-tranparent.png',
            type: 'PNG', //optional, when src= data:uri (nodejs case)
            // width: 20, //aspect ratio = width/height
            // height: 20,
            margin: {
              top: 0, //negative or positive num, from the current position
              left: 0, //negative or positive num, from the current position
            },
          },
          business: {
            name: 'CEDA Online Services',
            address: 'Four Thirty Square, Plot 54350, PG Matante Road CBD, Gaborone',
            phone: 'T : +267 317 0895',
            email: 'feedback@ceda.co.bw',
          },
          contact: {
            label: 'Required Document For Loan Application',
            name: this.loanType.toUpperCase() + ' - ' + this.loanApplicationSector?.toUpperCase(),
          },
          invoice: {
            label: 'Application Id: ',
            num: parseInt(this.applicationId) || 0,
            invDate: 'Date: ' + new Date().toLocaleDateString(),
            // invGenDate: 'Invoice Date: 02/02/2021 10:17',
            headerBorder: false,
            tableBodyBorder: false,
            header: [
              {
                title: '#',
                style: {
                  width: 10,
                },
              },
              {
                title: 'Document Name',
              },
              {
                title: 'Description',
              },
              {
                title: 'Is Mandatory',
                style: {
                  width: 50,
                },
              },
            ],
            table: Array.from(this.requiredDocuments, (item, index) => [
              index + 1,
              item.documentName,
              item.longDescription,
              item.isMandatory ? 'Yes' : 'No',
            ]),
          },
          footer: {
            text: 'The document is created on a computer and is valid without the signature and stamp.',
          },
          pageEnable: true,
          pageLabel: 'Page ',
        };

        // @ts-ignore
        const pdfObject = jsPDFInvoiceTemplate(props); //returns number of pages created

        // console.log('pdfObject', pdfObject);
      }
    });
  }

  async showRequiredFields() {
    const documentControlValidity = this.requiredDocuments.map((doc) => {
      const controlName = doc.controlName.trim();
      const validity = this.loanDocumentDetailsForm.get(controlName)?.valid;
      return {
        labelName: doc.labelName.trim(),
        validity: validity,
      };
    });

    const requiredFieldsForDocument = documentControlValidity
      .filter((item) => {
        return item.validity === false;
      })
      .map((items) => items.labelName);

    const size = requiredFieldsForDocument.length;

    if (size === 0) {
      this.toastr.success('Application saved successfully', 'Success', {});
      this.loanApplicationRequiredFiled.removeRequiredFields('document_details');
      return true;
    }

    this.loanApplicationRequiredFiled.setRequiredFileds(
      'document_details',
      requiredFieldsForDocument,
    );

    const itemsHtml = requiredFieldsForDocument.map(
      (item: any) => `<li class="list-item text-start">${item} </li>`,
    );

    await Swal.fire({
      title: 'Application Saved Successfully',
      icon: 'success',
      heightAuto: false,
      html: `
      <div class="d-flex flex-column g-4">
        <div class="fs-4">
          Please make sure to enter all required field below to move to next step
        </div>
        <div class="fs-3 mt-3 mb-1 py-3 bg-light-primary">Requried Documents</div>
        <ul class="list">
          ${itemsHtml.join('')}
        </ul>
      </div>
    `,
      customClass: {
        container: 'custom-container',
        popup: 'custom-popup',
        title: 'custom-title',
        confirmButton: 'custom-confirm-button',
        icon: 'custom-icon',
      },
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }
}
