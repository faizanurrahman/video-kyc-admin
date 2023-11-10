import { NgClass, NgIf, NgStyle, PathLocationStrategy, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { HttpLoaderService } from '../../../../../core/services/http-loader.service';
import { SweetAlertService } from '../../../../../core/services/sweet-alert.service';
import { DisclaimerService } from '../../../../../shared/data-access/disclaimer.service';
import { CustomValidators } from '../../../../../shared/utils/custom-validators';
import { HorizontalWizardComponent } from '../../../components/horizontal-wizard/horizontal-wizard.component';
import { WizardContentComponent } from '../../../components/horizontal-wizard/wizard-content/wizard-content.component';
import {
  WizardStep,
  WizardStepsComponent,
} from '../../../components/horizontal-wizard/wizard-steps/wizard-steps.component';
import { LoanApplicationMetadataComponent } from '../../../components/loan-application-metadata/loan-application-metadata.component';
import { LoanDisclaimerComponent } from '../../../components/loan-disclaimer/loan-disclaimer.component';
import { getLoanApplicationStepMetadata } from '../../../loan-application-wizard/loan-application-steps-metadata';
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationStatusType,
  LoanApplicationType,
  LoanApplicationTypeEnum,
} from '../../../models/loan-application.enum';
import { LoanApplicationStateService } from '../../../services/loan-application-state.service';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { ApplicationDetailFormComponent } from '../../application-detail-form/application-detail-form.component';
import { LegalPersonaFormV2Component } from '../../company-or-group-details/legal-persona-form-v2.component';
import { RequiredCompanyFields } from '../../company-or-group-details/required-field-for-company-details';
import { DocumentDetailsFormUpdatedComponent } from '../../document-details-form-updated/document-details-form-updated.component';
import { IndividualCountService } from '../../individual-form/individual-count.service';
import { IndividualFormComponent } from '../../individual-form/individual-form.component';
import { differentKinAddressesValidator } from '../../individual-form/kin-address-validator';
import { kinContactsWithinDifferentValidator } from '../../individual-form/kin-contact-within-individual-unique-validator';
import { omangNumberUniqueValidator } from '../../individual-form/omang-number-unique-validator';
import { primaryMobileNumberUniqueValidator } from '../../individual-form/primary-contact-across-individual.validator';
import { LoanApplicationReviewComponent } from '../../loan-application-review/loan-application-review.component';
import { MabogoDinkuApplicationDetailsFormComponent } from '../components/mabogo-dinku-application-details-form/mabogo-dinku-application-details-form.component';
import { MabogoDinkuDocumentDetailsFormComponent } from '../components/mabogo-dinku-document-details-form/mabogo-dinku-document-details-form.component';
import { MabogoDinkuGroupDetailsFormComponent } from '../components/mabogo-dinku-group-details-form/mabogo-dinku-group-details-form.component';
import { IndividualDetailsService } from '../components/mabogo-dinku-individual-form/individual-details.service';
import { MabogoDinkuIndividualFormComponent } from '../components/mabogo-dinku-individual-form/mabogo-dinku-individual-form.component';
import { MabogoDinkuReviewApplicationComponent } from '../components/mabogo-dinku-review-application/mabogo-dinku-review-application.component';
import { MabogoDinkuApplicationDetailsModel } from '../models/mabogo-dinku-application-details-model';
import { MabogoDinkuApplicationDataModel } from '../models/mabogo-dinku-application-model';
import { MabogoDinkuDocsModel } from '../models/mabogo-dinku-document-details-model';
import { MabogoDinkuGroupDetailsModel } from '../models/mabogo-dinku-group-details-model';
import { MabogoDinkuIndividualDetailsModel } from '../models/mabogo-dinku-individual-details-model';
import { MabogoDinkuApplicationRequiredFields } from '../services/mabogo-dinku-application-required-fields.service';
import { MabogoDinkuApplicationStateService } from '../services/mabogo-dinku-application-state.service';
import { MabogoDinkuApplicationFormService } from './mabogo-dinku-application-form.service';

@Component({
  selector: 'app-mabogo-dinku-application-wizard',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    InlineSVGModule,
    NgbTooltip,
    IndividualFormComponent,

    MabogoDinkuIndividualFormComponent,
    MabogoDinkuApplicationDetailsFormComponent,
    MabogoDinkuDocumentDetailsFormComponent,
    MabogoDinkuReviewApplicationComponent,
    MabogoDinkuGroupDetailsFormComponent,

    ApplicationDetailFormComponent,
    DocumentDetailsFormUpdatedComponent,
    LoanApplicationReviewComponent,
    LegalPersonaFormV2Component,
    LoanApplicationMetadataComponent,
    HorizontalWizardComponent,
    WizardStepsComponent,
    WizardContentComponent,
    TitleCasePipe,
    LoanDisclaimerComponent,
  ],
  templateUrl: './mabogo-dinku-application-wizard.component.html',
  styleUrls: ['./mabogo-dinku-application-wizard.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,

  providers: [LoanApplicationStateService],
})
export class MabogoDinkuApplicationWizardComponent implements OnInit {
  // ===
  public clickableStepCount = 0;
  // ================== ENUM Loan Application Type Declaraitons ==========================

  // applicant type
  public loanApplicationType: LoanApplicationType[] = Object.values(LoanApplicationTypeEnum);

  public individualLoanApplicationType: LoanApplicationTypeEnum =
    LoanApplicationTypeEnum.individual;

  public legalPersonaLoanApplicationType: LoanApplicationTypeEnum = LoanApplicationTypeEnum.company;
  public groupLoanApplicationType: LoanApplicationTypeEnum = LoanApplicationTypeEnum.group;
  public mabogoDinkuApplicationType: LoanApplicationTypeEnum = LoanApplicationTypeEnum.mabogoDinku;

  // ================== ENUM END ==========================

  // !form validity
  public individualFormValidity: boolean = false;
  public legalPersonaFormValidity: boolean = false;
  public loanApplicationServiceFormValidity: boolean = false;
  public loanApplicationDocumentFormValidity: boolean = false;

  //! form values
  public loanApplicationData: MabogoDinkuApplicationDataModel; // ! whole data
  public individualLoanApplicationDetails: MabogoDinkuIndividualDetailsModel[];
  public legalPersonaLoanApplicationDetails: MabogoDinkuGroupDetailsModel | any;
  public loanApplicationServiceDetails: MabogoDinkuApplicationDetailsModel[];
  public loanApplicationDocumentDetails: MabogoDinkuDocsModel;

  public currentFormValidity: boolean = false;

  // ======= Loan Application Meta Data =========
  public loanApplicationComment: string = 'No Additional Information Available';
  public loanApplicationStatus: LoanApplicationStatusType;
  public loanApplicationSector: LoanApplicationSectorType;
  public loanApplicationProductType: LoanApplicationProductType;
  public loanApplicationSapAppStatus: string;

  public loanType: LoanApplicationType;
  public currentApplicationId: string = '';
  public toggleLoanApplicationMetadata: boolean = false;

  public isPopupOpen = false;

  // ------------- Parent Form ------------------

  public mabogoDinkuApplicationForm: FormGroup;

  private readonly logger = inject(NGXLogger);
  private individualStateService = inject(IndividualDetailsService);

  constructor(
    private mabogoDinkuApplicationFormService: MabogoDinkuApplicationFormService,
    private mabogoDinkuApplicationStateService: MabogoDinkuApplicationStateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loanApplicationService: LoanApplicationService,
    private cdr: ChangeDetectorRef,
    public loadingService: HttpLoaderService,
    private loanApplicationStateService: LoanApplicationStateService,
    private destroyRef: DestroyRef,
    private locationStrategy: PathLocationStrategy,
    private swalService: SweetAlertService,
    private disclaimerService: DisclaimerService,
    private individualCountService: IndividualCountService,
    private mabogoDinkuApplicationRequiredFieldService: MabogoDinkuApplicationRequiredFields,
  ) {
    // console.log('Loan Application Management Component Constructor');

    this.mabogoDinkuApplicationForm =
      this.mabogoDinkuApplicationFormService.mabogoDinkuApplicationForm;

    this.logger.trace('Mabogo Dinku Application Form: ', this.mabogoDinkuApplicationForm.value);

    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((routeRes: any): any => {
          this.loanType = routeRes['loanType'];
          this.currentApplicationId = routeRes['applicationId'];
          this.loanApplicationSector = routeRes['sectorType'];
          this.loanApplicationProductType = routeRes['productType'];
          this.loanApplicationStatus = routeRes['loanApplicationStatus'];
          this.loanApplicationSapAppStatus = routeRes['loanApplicationSapAppStatus'];
          this.currentStep = parseInt(routeRes['currentStep'] || 1);
          this.currentStep$.next(this.currentStep);

          // ===== Set the Horizontal Wizard Steps =====
          this.steps = getLoanApplicationStepMetadata(this.loanType);
          return this.loanApplicationService.getAllLoanApplication();
        }),
      )
      .pipe(
        switchMap((allLoanApplicationRes: any): any => {
          // // console.log('All Loan Application Res: ', allLoanApplicationRes);
          const allApplication = allLoanApplicationRes?.data?.applications || [];
          const foundApplication = allApplication.find(
            (item: any) => item.applicationId === this.currentApplicationId,
          );
          this.loanApplicationStatus = foundApplication ? foundApplication.status : 'PENDING';

          if (foundApplication?.comments) {
            this.loanApplicationComment = foundApplication.comments;
          }

          // - set current step and status here
          this.loanApplicationStateService.currentLoanStatus = this.loanApplicationStatus;

          return this.loanApplicationService.getLoanApplicationDetailsMabogoDinku(
            this.currentApplicationId,
          ) as Observable<any>;

          // return of(MabogoDinkuApplicationFakeData).pipe(delay(2000));
        }),
      )

      .subscribe(async (loanApplicationResponse: any) => {
        // console.log('loan application response: ', loanApplicationResponse);
        this.logger.debug('Loan Application Response From Backend: ', loanApplicationResponse);

        this.loanApplicationData = loanApplicationResponse?.data?.appDetails || ({} as any);
        this.mabogoDinkuApplicationStateService.setMabogoDinkuFormData(this.loanApplicationData);
        this.mabogoDinkuApplicationForm.patchValue(this.loanApplicationData);

        // Count Number Of Keys for dynamically navigating to steps which has data
        const numOfKeys = Object.keys(this.loanApplicationData).length;
        // this.clickableStepCount = numOfKeys-1;
        this.clickableStepCount = 10;
        // console.log('Number of Clickable step is: ', this.clickableStepCount);
        // console.log('Objec keys are: ', Object.keys(this.loanApplicationData));

        await this.getIndividualLoanApplicationDetailsUpdated(this.loanApplicationData);
        await this.getLoanApplicationServiceDetailsUpdated(this.loanApplicationData);
        await this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        await this.getLoanApplicationDocumentDetails(this.loanApplicationData);

        if (
          this.loanApplicationStatus !== 'ACCEPTED' &&
          this.loanApplicationStatus !== 'APPLICATION_NOT_ACCEPTED' &&
          this.loanApplicationStatus !== 'SUBMITTED' &&
          this.loanApplicationStatus !== 'REQUEST_FOR_CHANGE' &&
          this.loanApplicationStatus !== 'REJECTED' &&
          this.loanApplicationStatus !== 'RESUBMITTED' &&
          this.currentStep === 1 &&
          this.clickableStepCount !== -1 &&
          window.location.href.includes('loan-application-management')
        ) {
          if (!this.isPopupOpen) {
            this.isPopupOpen = true;
            this.disclaimerService
              .showDisclaimerPopup('Loan Application Agreement')
              .then((value) => {
                this.isPopupOpen = false;
              });
          }
        }
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {}

  // -===================Integrading new horizontel steps ========================-
  public steps: WizardStep[] = [];

  private setStepsMetadata(loanType: LoanApplicationType) {
    this.steps = getLoanApplicationStepMetadata(loanType);
  }

  // -================ Current Step Management ====================
  public currentStep: number = 1;
  public currentStep$: BehaviorSubject<number> = new BehaviorSubject(1);

  // -=============== Url Masking & Update Parameter =========================
  updateQueryParam(currentStep: number) {
    // Get the current query parameters
    const queryParams = { ...this.activatedRoute.snapshot.queryParams };

    // Update the desired query parameter(s)
    queryParams.currentStep = currentStep;

    // Update the URL without navigating
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
      skipLocationChange: false,
    });
  }

  // -============ Step validation meter ===============-
  public stepValidityChanged(
    validityAndProgress: { validity: boolean; progress: number },
    index: number,
  ) {
    let { validity, progress } = validityAndProgress;

    if (validity) {
      progress = 100;
    }

    this.steps[index].stepStatus = validity ? 'valid' : 'invalid';
    this.steps[index].progress = progress;
    this.steps = [...this.steps];
  }

  // ngOnDestroy() {}

  // - ===== GETTER AND SETTER FOR LOAN APPLICATION DATA ======

  private async getIndividualLoanApplicationDetailsUpdated(
    loanApplicationData: MabogoDinkuApplicationDataModel,
  ) {
    const REQUIRED_FIELDS: any = {
      title: 'Title',
      fullName: 'First Name',
      surname: 'Last Name',
      dateOfBirth: 'Date of Birth',
      maritalStatus: 'Marital Status',

      mobileNumber: 'Mobile Number',
      // mobileNumberStatus: 'Mobile Number Verification',
      gender: 'Gender',
      nationality: 'Nationality',
      addrPlot: 'Standard Address: Street Name',
      addrSuburb: 'Standard Address: House Number',
      addrTown: 'Standard Address: Postal Code / City',
      postalAddrPoBox: 'Standard Address: Postal Address',
      postalAddrTown: 'Standard Address: Postal Address Town',
      addrCountry: 'Standard Address: Country',
      hvAddrPlot: 'Home Village Address: Street Name',
      hvAddrSuburb: 'Home Village Address: House Number',
      hvAddrTown: 'Home Village Address: Village',
      hvAddrCountry: 'Home Village Address: Country',
      nkAddrPlot: 'KIN Address: Street Name',
      nkAddrSuburb: 'KIN Address: House Number',
      nkAddrTown: 'KIN Address: Postal Code / City',
      nkAddrCountry: 'KIN Address: Country',
      nkContact: 'KIN Address: Contact',
      nkName: 'KIN Address: Name',
      nkRelationship: 'KIN Address: Relationship',
      nkAddrPlot2: 'KIN Address 2: Street Name',
      nkAddrSuburb2: 'KIN Address 2: House Number',
      nkAddrTown2: 'KIN Address 2: Postal Code / City',
      nkAddrCountry2: 'KIN Address 2: Country',
      nkContact2: 'KIN Address 2: Contact',
      nkName2: 'KIN Address 2: Name',
      nkRelationship2: 'KIN Address 2: Relationship',

      disability: 'Disability',
      disabilityType: 'Disability Type',
      nkSurname: 'KIN Address: Surname',
      nkSurname2: 'KIN Address 2: Surname',
      creditCheck: 'Credit Check',

      // confilict
      foreignPassportExpiry: 'Passport Expiry Date',
      foreignPassportNumber: 'Passport Number',

      omangNumber: 'Omang Number',
      dateOfOmangExpiry: 'Omang Expiry Date',
    };

    // Get individual loan application details from data
    const loanApplicationDetails = loanApplicationData?.loanIndividualDetails || [];

    const individualSize = loanApplicationDetails.length;
    this.individualLoanApplicationDetails = loanApplicationDetails;

    // Log the individual detials
    this.logger.trace('INDVIDUAL DETAILS MABOGO DINKU WIZARD: ', loanApplicationDetails);
    this.logger.debug('Individual Size:', individualSize);

    // Set individual count and data in the state service
    this.individualStateService.setIndividualCount(individualSize);
    this.individualStateService.setIndividualData(loanApplicationDetails);

    // Check if loanApplicationDetails is not an array
    if (!Array.isArray(loanApplicationDetails)) {
      return;
    }

    // Check if all required fields are filled
    const combineFillStatus = loanApplicationDetails.every((item: any) => item.fillStatus) || false;

    // Log the combined fill status
    this.logger.debug('Combined Fill Status:', combineFillStatus);

    // If every field is filled
    if (combineFillStatus && individualSize > 0) {
      this.mabogoDinkuApplicationRequiredFieldService.removeRequiredFields('individual_details');
      // Log the message
      this.logger.debug(
        'Required fields for individual details have been fulfilled. Removing from required field service.',
      );
      return;
    }

    let combinedRequiredFields: string[][] = [];

    if (!combineFillStatus && individualSize > 0) {
      loanApplicationDetails.forEach((item: MabogoDinkuIndividualDetailsModel) => {
        let requiredFields: string[] = [];
        let requiredFieldsKeys = Object.keys(REQUIRED_FIELDS);
        requiredFieldsKeys.forEach((fieldName) => {
          // @ts-ignore
          let fieldValue = item[fieldName];
          // this.logger.trace('key: ', fieldName, ' => ', fieldValue);

          if (
            fieldName === 'disabilityType' ||
            fieldName === 'foreignPassportExpiry' ||
            fieldName === 'foreignPassportNumber' ||
            fieldName === 'omangNumber' ||
            fieldName === 'dateOfOmangExpiry' ||
            fieldName === 'disability' // disability is by default set
          ) {
            fieldValue = ['Skip these controls to check, because they are dynamically required'];
          }

          // Handle Mobile Number Fields with country code
          if (fieldValue !== null && fieldValue !== undefined && fieldValue.includes('-')) {
            let splittedValues = fieldValue.split('-');
            fieldValue = splittedValues[1];
          }

          if (!fieldValue) {
            requiredFields.push(fieldName);
          }
        });

        if (requiredFields.length > 0) {
          combinedRequiredFields.push(requiredFields);
        } else if (!item.fillStatus) {
          combinedRequiredFields.push([
            'Required Fields are missing, make sure to provide all required fields',
          ]);
        } else {
          combinedRequiredFields.push(['✅ All Required Details Are Filled']);
        }
      });
    }

    if (individualSize === 0) {
      combinedRequiredFields.push(['Please add atleast 5 individual shareholder detials']);
    }

    // Log the combined required fields
    this.logger.debug(
      'Combined Required Fields For Individual Details Service:',
      combinedRequiredFields,
    );

    // Set the required fields
    this.mabogoDinkuApplicationRequiredFieldService.setRequiredFields(
      'individual_details',
      combinedRequiredFields,
    );
  }
  private async getLoanApplicationServiceDetailsUpdated(
    loanApplicationData: MabogoDinkuApplicationDataModel,
  ) {
    // Required Fields
    const REQUIRED_FIELDS = {
      product: 'Project Description',
      applicationAmount: 'Application Amount',
      branchId: 'Nearest Branch',
      memberSaving: 'Saving',
    };

    // Get individual loan application details from data
    const loanApplicationDetails = loanApplicationData?.loanServiceCentre || [];
    const individualSize = loanApplicationDetails.length;

    this.loanApplicationServiceDetails = loanApplicationDetails;

    // Log individual count and application details
    this.logger.debug('SERVICE CENTRE SIZE: ', individualSize);
    this.logger.debug('SERVICE CENTRE DETILS: : ', loanApplicationDetails);

    // Check if loanApplicationDetails is not an array
    if (!Array.isArray(loanApplicationDetails)) {
      return;
    }

    // Check if all required fields are filled
    const combineFillStatus = loanApplicationDetails.every((item: any) => item.fillStatus) || false;

    // Log the combined fill status
    this.logger.debug('Combined Fill Status**: ', combineFillStatus);

    // If every field is filled
    if (combineFillStatus && individualSize > 0) {
      this.mabogoDinkuApplicationRequiredFieldService.removeRequiredFields('application_details');
      // Log the message
      this.logger.debug(
        'APPLICATION DETAILS REMOVED: All required fields have been filled, removing from required field service',
      );
      return;
    }

    let combinedRequiredFields: string[][] = [];

    if (!combineFillStatus && individualSize > 0) {
      loanApplicationDetails.forEach((item: MabogoDinkuApplicationDetailsModel) => {
        let requiredFields: string[] = [];
        // Get the keys of required fields
        let requiredFieldsKeys = Object.keys(REQUIRED_FIELDS);
        requiredFieldsKeys.forEach((fieldName) => {
          // @ts-ignore
          let fieldValue = item[fieldName];
          if (!fieldValue) {
            requiredFields.push(fieldName);
          }
        });

        if (requiredFields.length > 0) {
          combinedRequiredFields.push(requiredFields);
        } else if (item.fillStatus) {
          combinedRequiredFields.push([
            'Required Fields are missing, make sure to provide all required fields',
          ]);
        } else {
          combinedRequiredFields.push(['✅ All Required Fields are fully filled']);
        }
      });
    }

    if (individualSize === 0) {
      combinedRequiredFields.push([
        'Please add atleast 5 individual shareholder application detials',
      ]);
    }

    // Log the combined required fields
    this.logger.debug(
      'Combined Required Fields For Application Details Service: ',
      combinedRequiredFields,
    );

    // Set the required fields
    this.mabogoDinkuApplicationRequiredFieldService.setRequiredFields(
      'application_details',
      combinedRequiredFields,
    );
  }

  private async getLoanApplicationDocumentDetails(
    loanApplicationData: MabogoDinkuApplicationDataModel,
  ) {
    this.loanApplicationDocumentDetails = loanApplicationData?.loanDocs || ({} as any);

    // Log the doc details
    this.logger.trace('LOAN APPLICATION DOCUMENT DETIALS: ', this.loanApplicationDocumentDetails);
    this.logger.trace('DOCUMENT SIZE: ', this.loanApplicationDocumentDetails);
    if (Object.keys(this.loanApplicationDocumentDetails).length === 0) {
      this.mabogoDinkuApplicationRequiredFieldService.setRequiredFields('document_details', [
        'Please upload all required Document to proceed for each individual shareholder',
      ]);
    }
    // Todo: Calculate the Required Fields Based on Individual Details and Loan Application Type

    // if (!this.loanApplicationDocumentDetails) {
    //   this.mabogoDinkuApplicationRequiredFieldService.setRequiredFields('document_details', [
    //     'please upload all required document to proceed',
    //   ]);
    // }
  }

  private async getLegalPersonaLoanApplicationDetails(
    loanApplicationData: MabogoDinkuApplicationDataModel,
  ) {
    if (this.loanType.toLowerCase() === 'individual') {
      return;
    }
    this.legalPersonaLoanApplicationDetails = loanApplicationData?.loanLegalPersona || ({} as any);

    this.logger.log(
      'Loan Application Group/Company/Mabogodinku Details From Backend: ',
      this.legalPersonaLoanApplicationDetails,
    );

    let fillStatus = this.legalPersonaLoanApplicationDetails.fillStatus || false;

    let companyRequiredFieldsMap = RequiredCompanyFields;
    let companyRequiredFields: any[] = [];
    let comapnyRequiredFieldControlName = Object.keys(companyRequiredFieldsMap);
    for (let i = 0; i < comapnyRequiredFieldControlName.length; i++) {
      let currentReqiredControlName: any = comapnyRequiredFieldControlName[i];

      let currentControlValue = this.legalPersonaLoanApplicationDetails[currentReqiredControlName];

      // skipping mobile country code
      if (
        currentControlValue !== null &&
        currentControlValue !== undefined &&
        currentControlValue.includes('-')
      ) {
        let splittedValues = currentControlValue.split('-');

        currentControlValue = splittedValues[1];
      }

      if (currentReqiredControlName === 'registrationNumber') {
        currentControlValue = 'Default Value to skip it';
      }
      if (
        currentControlValue === null ||
        currentControlValue === '' ||
        currentControlValue === undefined
      ) {
        companyRequiredFields.push(RequiredCompanyFields[currentReqiredControlName]);
      }
    }

    if (companyRequiredFields.length > 0) {
      this.mabogoDinkuApplicationRequiredFieldService.setRequiredFields(
        'company_details',
        companyRequiredFields,
      );
    } else if (fillStatus === false) {
      this.mabogoDinkuApplicationRequiredFieldService.setRequiredFields('company_details', [
        'Details are not filled, please fill the all required field to continue',
      ]);
    } else {
      this.mabogoDinkuApplicationRequiredFieldService.removeRequiredFields('company_details');
    }
  }

  // - ==== STEP NAVIGATION ====

  // application action
  public nextStep() {
    const nextStep = this.currentStep$.value + 1;

    if (nextStep > this.steps.length) {
      return;
    }

    this.currentStep$.next(nextStep);
    this.steps[nextStep - 1].stepState = 'done';
    this.steps[nextStep - 1].stepStatus = 'valid';
    this.steps[nextStep - 1].progress = 100;

    this.updateQueryParam(this.currentStep$.value);

    this.loanApplicationService
      .getLoanApplicationDetails(this.currentApplicationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loanApplicationDataResponse: any) => {
        this.loanApplicationData = loanApplicationDataResponse.data.appDetails || {};

        this.getIndividualLoanApplicationDetailsUpdated(this.loanApplicationData);
        this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        this.getLoanApplicationServiceDetailsUpdated(this.loanApplicationData);
        this.getLoanApplicationDocumentDetails(this.loanApplicationData);

        this.cdr.detectChanges();
      });
  }

  public previousStep() {
    // if (this.currentStep === 1) return;

    const prevStep = this.currentStep$.value - 1;

    this.steps[prevStep].stepState = 'pending';
    this.steps[prevStep].stepStatus = 'invalid';

    if (prevStep === 0) {
      return;
    }
    this.currentStep$.next(prevStep);

    // update the current step in the router query params
    this.updateQueryParam(this.currentStep$.value);
    this.loanApplicationService
      .getLoanApplicationDetails(this.currentApplicationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (loanApplicationDataResponse: any) => {
        this.loanApplicationData = loanApplicationDataResponse.data.appDetails;

        await this.getIndividualLoanApplicationDetailsUpdated(this.loanApplicationData);
        await this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        await this.getLoanApplicationServiceDetailsUpdated(this.loanApplicationData);
        await this.getLoanApplicationDocumentDetails(this.loanApplicationData);

        this.cdr.detectChanges();
      });
  }

  onStepChangesTo(index: number) {
    this.currentStep$.next(index);
    this.updateQueryParam(this.currentStep$.value);

    this.loanApplicationService
      .getLoanApplicationDetailsMabogoDinku(this.currentApplicationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (loanApplicationDataResponse: any) => {
        this.loanApplicationData = loanApplicationDataResponse.data.appDetails;

        await this.getIndividualLoanApplicationDetailsUpdated(this.loanApplicationData);
        await this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        await this.getLoanApplicationServiceDetailsUpdated(this.loanApplicationData);
        await this.getLoanApplicationDocumentDetails(this.loanApplicationData);

        this.cdr.detectChanges();
      });
  }

  private fb = inject(FormBuilder);
  private ufb = inject(UntypedFormBuilder);
  private parentForm: FormGroup;
  private uParentForm: UntypedFormGroup;

  private createParentForm() {
    this.parentForm = this.fb.group({
      loanBasicDetails: this.fb.group({
        applicationId: [''],
        createdOn: [''],
        loanApplicationType: [''],
        productType: [''],
        sectorType: [''],
        status: [''],
        updatedOn: [''],
      }),
      loanLegalPersona: this.fb.group({
        id: [''],
        applicationId: [''],
        sessionId: [''],
        nameOfOrganization: [
          '',
          [Validators.required, CustomValidators.firstLetterCapitalizedValidator()],
        ],
        // dateOfIncorporation: ['', [Validators.required]],
        registrationNumber: ['', [Validators.required, Validators.pattern(/^BW\d{11}$/i)]],
        // Note: registration number is changed to UIN number
        preferredCorrespondanceAddr: ['', [Validators.required]],
        postalAddrPoBox: ['', [Validators.required]],
        postalAddrTown: ['', [Validators.required]],
        bussAddrPlot: ['', [Validators.required]],
        bussAddrLocation: ['', []],
        bussAddrDistrict: ['', [Validators.required]],
        bussAddrCountry: ['', [Validators.required]],
        bussAddrTradingAs: ['', []],
        numberOfContacts: ['', []],
        // primaryContactPreferredCommType: ['', [Validators.required]],
        primaryContactMobNumberCode: ['267', [Validators.required]],
        primaryContactMobNumber: ['', [Validators.required, Validators.pattern(/^7\d{3}\d{4}$/)]],

        primaryContactOtherContactNumber: ['', []],
        primaryContactOtherContactNumberCode: ['267', []],
        primaryContactEmailAddress: [
          '',
          [Validators.required, CustomValidators.emailAddressValidator()],
        ],
        fillStatus: [false],
      }),
      loanIndividualDetails: this.fb.group(
        {
          applicationId: [''],
          sessionId: [''],
          username: [''],
          individualList: this.fb.array([this.createIndividual()], { updateOn: 'change' }),
        },
        {
          updateOn: 'change',
          validators: [omangNumberUniqueValidator(), primaryMobileNumberUniqueValidator()],
        },
      ),
      loanServiceCentre: this.fb.array([this.createServiceCentre()]),
      loanDocs: this.fb.group({
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
      }),
    });
  }

  private createIndividual() {
    let individualForm = this.fb.group(
      {
        id: [''],
        title: ['', [Validators.required]],
        fullName: ['', [Validators.required]],
        dob: ['', []],
        dateOfBirth: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        maritalStatus: ['', [Validators.required]],
        maritalRegime: [''],
        botswanaCitizen: ['', []],
        omangNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.pattern(/^\d{4}[12]\d{4}$/),
          ],
        ],
        dateOfOmangExpiry: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        foreignPassportNumber: ['', []],

        foreignPassportExpiry: ['', []],
        nationality: ['', [Validators.required]],
        communicationType: ['', []],
        mobileNumber: ['', [Validators.required]],
        mobileNumberCountryCode: ['267'],
        mobileNumberStatus: new FormControl<'NOT_VERIFIED' | 'VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
          Validators.pattern('VERIFIED'),
        ]),

        secondaryMobileNumber: ['', []],
        secondaryMobileNumberCountryCode: ['267'],
        otherContactNumber: ['', []],
        otherContactNumberCountryCode: ['267'],
        emailAddress: ['', []],
        emailAddressStatus: new FormControl<'NOT_VERIFIED' | 'VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
        ]),
        corresspondanceAddress: ['', []],
        addrPlot: ['', [Validators.required]],
        addrSuburb: ['', [Validators.required]],
        addrTown: ['', [Validators.required]],
        addrCountry: ['', [Validators.required]],
        addrDuration: ['', []],
        postalAddrPoBox: ['', [Validators.required]],
        postalAddrTown: ['', [Validators.required]],

        hvAddrPlot: ['', [Validators.required]],
        hvAddrSuburb: ['', [Validators.required]],
        hvAddrTown: ['', [Validators.required]],
        hvAddrCountry: ['', [Validators.required]],
        nkAddrPlot: ['', [Validators.required]],
        nkAddrSuburb: ['', [Validators.required]],
        nkAddrTown: ['', [Validators.required]],
        nkAddrCountry: ['', [Validators.required]],
        nkContact: ['', [Validators.required]],
        nkContactCountryCode: ['267'],
        nkName: ['', [Validators.required]],
        nkSurname: ['', [Validators.required]],
        nkRelationship: ['', [Validators.required]],

        nkAddrPlot2: ['', [Validators.required]],
        nkAddrSuburb2: ['', [Validators.required]],
        nkAddrTown2: ['', [Validators.required]],
        nkAddrCountry2: ['', [Validators.required]],
        nkContact2: ['', [Validators.required]],
        nkContact2CountryCode: ['267'],
        nkName2: ['', [Validators.required]],
        nkSurname2: ['', [Validators.required]],
        nkRelationship2: ['', [Validators.required]],

        bussAddrPlot: ['', []], // removed required
        bussAddrSuburb: ['', []], // removed required
        bussAddrTown: ['', []],
        bussAddrCountry: ['', []], // removed required
        bussAddrTradingAs: ['', []],
        disability: ['', [Validators.required]],
        disabilityType: ['', []],
        disabilityDocuments: [[], []],
        creditCheck: ['', [Validators.required]],
        fillStatus: [false],
      },
      {
        updateOn: 'change',
        validators: [differentKinAddressesValidator(), kinContactsWithinDifferentValidator()],
      },
    );
    return individualForm;
  }

  private createServiceCentre() {
    return this.fb.group({
      id: [],
      applicationId: [''],
      sessionId: [''],
      individualId: [],
      memberSaving: ['', [Validators.required]],
      branchId: ['', { validators: [Validators.required], updateOn: 'change' }],
      applicationAmount: [
        '',
        {
          validators: [Validators.required, Validators.pattern(/[0-9]+/)],
          updateOn: 'blur',
        },
      ],
      product: ['', { validators: [Validators.required], updateOn: 'change' }],
      fillStatus: [false],
    });
  }
}
