/* eslint-disable max-len */
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { cloneDeep } from 'lodash';

declare var require: any;

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import { NGXLogger } from 'ngx-logger';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TabViewModule } from 'primeng/tabview';
import { distinctUntilChanged, of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpLoaderService } from '../../../../../../core/services/http-loader.service';
import { SweetAlertService } from '../../../../../../core/services/sweet-alert.service';
import { ClickableDirective } from '../../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationType,
} from '../../../../models/loan-application.enum';
import { LoanApplicationStateService } from '../../../../services/loan-application-state.service';
import { LoanApplicationService } from '../../../../services/loan-application.service';
import { InvoiceProps } from '../../../document-details-form-updated/document-model';
import { DocumentUploadControlData } from '../../../document-details-form-updated/file-upload.model';
import { FileUploaderV2Component } from '../../../document-details-form-updated/file-uploader-v2/file-uploader-v2.component';
import {
  LoanApplicationDocumentUtils,
  LoanApplicationRequiredDocumentModel,
} from '../../../document-details-form-updated/latest-document-details-helper.utils';
import { IndividualCountService } from '../../../individual-form/individual-count.service';
import { MabogoDinkuApplicationRequiredFields } from '../../services/mabogo-dinku-application-required-fields.service';
import { DocumentUploaderComponent } from './document-uploader/document-uploader.component';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-mabogo-dinku-document-details-form',
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
    DocumentUploaderComponent,
    AsyncPipe,
    ClickableDirective,
    TabViewModule,
  ],
  templateUrl: './mabogo-dinku-document-details-form.component.html',
  styleUrls: ['./mabogo-dinku-document-details-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MabogoDinkuDocumentDetailsFormComponent {
  activeIndex: number = 0;
  public applicantHasDisability: boolean[] = [false];
  public hasCreditCheckDocuemnt: boolean[] = [false];
  public creditCheckType: ('clean' | 'adverse' | null)[] = [null];
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
  public requiredDocuments: LoanApplicationRequiredDocumentModel[][] = [];

  private readonly logger = inject(NGXLogger);
  public individualIds: any[] = [];

  constructor(
    private fb: FormBuilder,
    public loader: HttpLoaderService,
    private toastr: ToastrService,
    private loanApplicationStatusService: LoanApplicationStateService,
    private activatedRoute: ActivatedRoute,
    private loanApplicationService: LoanApplicationService,
    private destroyRef: DestroyRef,
    private individualCountService: IndividualCountService,
    private loanApplicationRequiredFiled: MabogoDinkuApplicationRequiredFields,
    private swalService: SweetAlertService,
  ) {
    this.loading$ = this.loader.loading$;

    // Getting application id details
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get('applicationId')!;
    // console.log('Constructor in Document Details UPdated');
  }

  private updateFormValidator() {
    this.requiredDocuments[0].forEach(
      (item: LoanApplicationRequiredDocumentModel, index: number) => {
        if (item.isMandatory) {
          this.loanDocumentDetailsForm.get(item.controlName)?.setValidators(Validators.required);
        } else {
          this.loanDocumentDetailsForm.get(item.controlName)?.clearValidators();
        }

        // this.loanDocumentDetailsForm.get(item.controlName)?.addValidators(Validators.required);
      },
    );
    this.loanDocumentDetailsForm.updateValueAndValidity();
  }

  ngOnInit() {
    // Initialize loan Document Details
    this.initializeLoanDocumentForm();

    this.logger.log('Inside Onint Document Component');

    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // - Extracting meta data from router queryParameter
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
            .getLoanApplicationDetailsMabogoDinku(this.applicationId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        switchMap((res: any) => {
          const loanDocs = res.data.appDetails.loanDocs;

          let requiredDocumentsForApplicaton = LoanApplicationDocumentUtils.getRequiredDocuments(
            this.loanApplicationSector,
            this.loanType,
            this.loanApplicationProductType,
          )
            .filter((item: LoanApplicationRequiredDocumentModel) => {
              return item.isRequired && item.numberOfDocument !== 0;
            })
            .map((item: LoanApplicationRequiredDocumentModel) => {
              // Letlhabile applications attachments on Financial Projections should not be mandatory as it’s not a requirement
              if (
                this.loanApplicationProductType === 'letlhabile' &&
                (item.controlName === 'financialProjectionsFor5years' ||
                  item.controlName === 'financialProjections')
              ) {
                item.isMandatory = false;
              }

              // If individual count is greater than 1 then set document count whenever it is -1;

              if (item.numberOfDocument === -1) {
                item.numberOfDocument = numberOfIndividual;
                item.longDescription =
                  item.longDescription +
                  ' Note: For group loan applications, please ensure to include the relevant documents for each individual in the group.';
              }
              return item;
            });

          // Add Additional Data
          requiredDocumentsForApplicaton.push(
            // Add Additional Data
            {
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
            },
          );

          const individualDetails = res.data.appDetails.loanIndividualDetails || [];
          this.individualIds = individualDetails.map((item: any) => item.id);
          const numberOfIndividual = individualDetails.length;

          this.logger.trace('Indvidual Details: ', individualDetails);
          // todo: Add this popup when no individual Found
          if (numberOfIndividual === 0) {
            this.swalService.error(
              'Invalid Individual Details',
              'Please, First Fill the Individual Details to upload the documents ',
            );
          }
          individualDetails.forEach((individualData: any, i: any) => {
            this.requiredDocuments[i] = cloneDeep(requiredDocumentsForApplicaton);

            console.log('Required Documents: ', this.requiredDocuments);

            if (individualData.disability) {
              this.requiredDocuments[i].push({
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
              this.applicantHasDisability[i] = true;
            } else {
              this.applicantHasDisability[i] = false;
            }

            if (individualData.creditCheck) {
              this.hasCreditCheckDocuemnt[i] = true;
              if (individualData.creditCheck === 'clean') {
                this.requiredDocuments[i].push({
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
                this.creditCheckType[i] = 'clean';
              } else if (individualData.creditCheck === 'adverse') {
                this.requiredDocuments[i].push({
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
                this.creditCheckType[i] = 'adverse';
              }
            } else {
              this.hasCreditCheckDocuemnt[i] = false;
              this.creditCheckType[i] = null;
            }
          });
          // console.log('RES----------------', res);
          this.logger.trace('Individual Required Document Controls', this.requiredDocuments);

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
          response === 'REJECTED' ||
          response === 'RESUBMITTED'
        ) {
          this.loanDocumentDetailsForm.disable();
          this.isApplicationDisabled = true;
        } else {
          this.isApplicationDisabled = false;
          // show guidline
          this.showGuidelines();
        }
      });
  }

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
    const individualId = doc?.individualId;

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
      individualId: doc.individualId,
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

  public showGuidelines() {
    let requiredDocuments = cloneDeep(this.requiredDocuments);

    let listOfItems = requiredDocuments.map((requireItems, i) => {
      let listItems = requireItems
        .filter((item) => item.isMandatory)
        .map(({ labelName }) => {
          return `
          <li class="list-item text-start"> ${labelName}</li>`;
        });

      return `
      <div class="fs-5 mt-3 mb-1 py-3 bg-light-secondary"> Individual ${i + 1} </div>
        <ul class="list">
           ${listItems.join('')}
        </ul>
      `;
    });

    Swal.fire({
      title: 'Guidelines for uploading documents',
      icon: 'info',
      html: `
      <div class="d-flex flex-column g-4">
        <div class="fs-4">
          Please make sure to follow and read the guidelines while uploading documents
        </div>
        <div class="fs-3 mt-3 mb-1 py-3 bg-light-primary">Document Required</div>
        ${listOfItems.join('\n')}

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
        const requiredDocumentsNames = this.requiredDocuments
          .reduce((result, curr) => result.concat(curr), [])
          .map((doc) => {
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
            table: Array.from(this.requiredDocuments[0], (item, index) => [
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
    let notFilledDocumentsLabel = this.requiredDocuments.map((requiredDocument) => {
      let notFilledNames = requiredDocument
        .map((doc, i) => {
          let controlName = doc.controlName.trim();
          let labelName = doc.labelName.trim();
          let individualId = doc.individualId;
          let control = this.loanDocumentDetailsForm.get(controlName);

          let validity = control?.valid;

          let combineValidity = validity;

          return {
            labelName: doc.labelName.trim(),
            validity: combineValidity,
          };
        })
        .filter((item) => !item.validity)
        .map((item) => item.labelName);

      return notFilledNames;
    });

    let isFilled = notFilledDocumentsLabel.every((item) => item.length === 0);
    if (isFilled) {
      this.toastr.success('Loan Application Saved Successfully', 'Saved');
      this.loanApplicationRequiredFiled.removeRequiredFields('document_details');
      return true;
    }

    this.loanApplicationRequiredFiled.setRequiredFields(
      'document_details',
      notFilledDocumentsLabel,
    );

    let requiredFieldHTML = notFilledDocumentsLabel.map((items, i) => {
      let itemsHtml = items.map((item) => `<li class="list-item text-start"> ${item} </li>`);

      return `
      <div class="fs-5 mt-3 mb-1 py-3 secondary">Individual ${i + 1}</div>
        <ul class="list">
          ${itemsHtml.join('')}
        </ul>
      `;
    });

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
        ${requiredFieldHTML.join('\n')}

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
