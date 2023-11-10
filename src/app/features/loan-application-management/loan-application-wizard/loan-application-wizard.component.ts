/* eslint-disable max-len */
import { NgClass, NgIf, NgStyle, PathLocationStrategy, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpLoaderService } from '@core/services/http-loader.service';
import { environment } from '@environments/environment';
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationStatusType,
  LoanApplicationType,
  LoanApplicationTypeEnum,
} from '@lam/models/loan-application.enum';
import { LoanApplicationDataModel, LoanApplicationModel } from '@lam/models/loan-application.model';
import { LoanApplicationStateService } from '@lam/services/loan-application-state.service';
import { LoanApplicationService } from '@lam/services/loan-application.service';
import { ApplicationDetailFormComponent } from '@las/application-detail-form/application-detail-form.component';
import { LoanApplicationServiceDetailsModel } from '@las/application-detail-form/loan-application-service.model';
import { LegalPersonaFormV2Component } from '@las/company-or-group-details/legal-persona-form-v2.component';
import { LoanApplicationCompanyOrGroupModel } from '@las/company-or-group-details/loan-application-company-or-group.interface';
import { DocumentDetailsFormUpdatedComponent } from '@las/document-details-form-updated/document-details-form-updated.component';
import { NewLoanDocsModel } from '@las/document-details-form-updated/document-model';
import { IndividualFormComponent } from '@las/individual-form/individual-form.component';
import { IndividualDetailsModel } from '@las/individual-form/individual-form.model';
import { LoanApplicationReviewComponent } from '@las/loan-application-review/loan-application-review.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';
import { DisclaimerService } from '../../../shared/data-access/disclaimer.service';
import { HorizontalWizardComponent } from '../components/horizontal-wizard/horizontal-wizard.component';
import { WizardContentComponent } from '../components/horizontal-wizard/wizard-content/wizard-content.component';
import {
  WizardStep,
  WizardStepsComponent,
} from '../components/horizontal-wizard/wizard-steps/wizard-steps.component';
import { LoanApplicationMetadataComponent } from '../components/loan-application-metadata/loan-application-metadata.component';
import { LoanDisclaimerComponent } from '../components/loan-disclaimer/loan-disclaimer.component';
import { RequiredApplicationDetailsFields } from '../loan-application-steps/application-detail-form/required-fields-for-application-details';
import { RequiredCompanyFields } from '../loan-application-steps/company-or-group-details/required-field-for-company-details';
import { IndividualCountService } from '../loan-application-steps/individual-form/individual-count.service';
import { RequiredIndividualFields } from '../loan-application-steps/individual-form/required-field';
import { MabogoDinkuApplicationDetailsFormComponent } from '../loan-application-steps/mabogo-dinku-steps/components/mabogo-dinku-application-details-form/mabogo-dinku-application-details-form.component';
import { MabogoDinkuDocumentDetailsFormComponent } from '../loan-application-steps/mabogo-dinku-steps/components/mabogo-dinku-document-details-form/mabogo-dinku-document-details-form.component';
import { MabogoDinkuGroupDetailsFormComponent } from '../loan-application-steps/mabogo-dinku-steps/components/mabogo-dinku-group-details-form/mabogo-dinku-group-details-form.component';
import { MabogoDinkuIndividualFormComponent } from '../loan-application-steps/mabogo-dinku-steps/components/mabogo-dinku-individual-form/mabogo-dinku-individual-form.component';
import { MabogoDinkuReviewApplicationComponent } from '../loan-application-steps/mabogo-dinku-steps/components/mabogo-dinku-review-application/mabogo-dinku-review-application.component';
import { LoanApplicationRequiredFieldService } from '../state-management/loan-application-required-field-management.service';
import { getLoanApplicationStepMetadata } from './loan-application-steps-metadata';

@Component({
  selector: 'app-loan-application-wizard',
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
  templateUrl: './loan-application-wizard.component.html',
  styleUrls: ['./loan-application-wizard.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,

  providers: [LoanApplicationStateService],
})
export class LoanApplicationWizardComponent implements OnInit {
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
  public loanApplicationData: LoanApplicationDataModel; // ! whole data
  public individualLoanApplicationDetails: IndividualDetailsModel[];
  public legalPersonaLoanApplicationDetails: LoanApplicationCompanyOrGroupModel | any;
  public loanApplicationServiceDetails: LoanApplicationServiceDetailsModel;
  public loanApplicationDocumentDetails: NewLoanDocsModel;

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

  constructor(
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
    private loanApplicationRequiredField: LoanApplicationRequiredFieldService,
  ) {
    // console.log('Loan Application Management Component Constructor');

    this.activatedRoute.queryParams
      .pipe(
        takeUntilDestroyed(),
        switchMap((routeRes: any): any => {
          this.loanType = routeRes['loanType'];
          this.currentApplicationId = routeRes['applicationId'];
          this.loanApplicationSector = routeRes['sectorType'];
          this.loanApplicationProductType = routeRes['productType'];
          this.loanApplicationStatus = routeRes['loanApplicationStatus'];
          this.loanApplicationSapAppStatus = routeRes['loanApplicationSapAppStatus'];
          this.currentStep = parseInt(routeRes['currentStep'] || 1);
          this.currentStep$.next(this.currentStep);

          this.urlMasking();

          // ===== Set the Horizontal Wizard Steps =====
          this.setStepsMetadata(this.loanType);
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
          this.urlMasking();

          if (foundApplication?.comments) {
            this.loanApplicationComment = foundApplication.comments;
          }

          // - set current step and status here
          this.loanApplicationStateService.currentLoanStatus = this.loanApplicationStatus;

          return this.loanApplicationService.getLoanApplicationDetails(
            this.currentApplicationId,
          ) as Observable<LoanApplicationModel>;
        }),
      )

      .subscribe((loanApplicationResponse: any): any => {
        console.log('loan application response: ', loanApplicationResponse);

        this.loanApplicationData = loanApplicationResponse?.data?.appDetails || ({} as any);

        // Count Number Of Keys for dynamically navigating to steps which has data
        const numOfKeys = Object.keys(this.loanApplicationData).length;
        // this.clickableStepCount = numOfKeys-1;
        this.clickableStepCount = 10;
        // console.log('Number of Clickable step is: ', this.clickableStepCount);
        // console.log('Objec keys are: ', Object.keys(this.loanApplicationData));

        this.getIndividualLoanApplicationDetails(this.loanApplicationData);
        this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        this.getLoanApplicationServiceDetails(this.loanApplicationData);
        this.getLoanApplicationDocumentDetails(this.loanApplicationData);

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
          // const disclaimerComponent =
          //   this.viewContainerRef.createComponent(LoanDisclaimerComponent);
          // this.showLoanApplicationDisclaimer();

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
  private urlMasking() {
    if (!environment.urlMaskingEnabled) return;

    if (
      this.loanApplicationStatus !== 'ACCEPTED' &&
      this.loanApplicationStatus !== 'APPLICATION_NOT_ACCEPTED' &&
      this.loanApplicationStatus !== 'SUBMITTED' &&
      this.loanApplicationStatus !== 'REQUEST_FOR_CHANGE' &&
      this.loanApplicationStatus !== 'REJECTED'
    ) {
      this.locationStrategy.replaceState(
        null,
        'loan-application-management/init',
        '/#/loan-application-create',
        'applicationId=' + this.currentApplicationId,
      );
    } else {
      this.locationStrategy.replaceState(
        null,
        'loan-application-management/init',
        '/#/loan-application-view',
        'applicationId=' + this.currentApplicationId,
      );
    }
  }

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
      skipLocationChange: environment.urlMaskingEnabled ? true : false,
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

    // console.log('Step Validity Changed: ', index, validity, progress);
    this.steps = [...this.steps];
  }

  // ngOnDestroy() {}

  // - ===== GETTER AND SETTER FOR LOAN APPLICATION DATA ======
  private getIndividualLoanApplicationDetails(loanApplicationData: LoanApplicationDataModel) {
    this.individualLoanApplicationDetails = loanApplicationData?.loanIndividualDetails || [];
    this.individualCountService.individualCount = this.individualLoanApplicationDetails?.length;
    let combinedFillStatus: boolean = true;
    if (this.individualLoanApplicationDetails?.length > 0) {
      let oldData: any[] = [];
      this.individualLoanApplicationDetails.forEach((item: any) => {
        let fillStatus = item.fillStatus;

        let individualDetailsRequiredFieldsMap = RequiredIndividualFields;
        let individualDetailsRequiredFields: any[] = [];
        let individualDetailsRequiredFieldControlName = Object.keys(
          individualDetailsRequiredFieldsMap,
        );
        for (let i = 0; i < individualDetailsRequiredFieldControlName.length; i++) {
          let currentReqiredControlName: any = individualDetailsRequiredFieldControlName[i];
          let currentControlValue = item[currentReqiredControlName];
          // console.log('currentControlValue: ', currentControlValue);
          // skipping mobile country code
          if (
            currentControlValue !== null &&
            currentControlValue !== undefined &&
            currentControlValue !== true &&
            currentControlValue !== false &&
            currentControlValue.includes('-')
          ) {
            let splittedValues = currentControlValue.split('-');

            currentControlValue = splittedValues[1];
          }

          if (
            currentReqiredControlName === 'disabilityType' ||
            currentReqiredControlName === 'foreignPassportExpiry' ||
            currentReqiredControlName === 'foreignPassportNumber' ||
            currentReqiredControlName === 'omangNumber' ||
            currentReqiredControlName === 'dateOfOmangExpiry'
          ) {
            currentControlValue = ['default value to skip it in missing field'];
          }
          if (
            currentControlValue === null ||
            currentControlValue === '' ||
            currentControlValue === undefined
          ) {
            individualDetailsRequiredFields.push(
              RequiredIndividualFields[currentReqiredControlName],
            );
          }
        }

        if (individualDetailsRequiredFields.length > 0) {
          oldData.push(individualDetailsRequiredFields);
          combinedFillStatus = false;
        } else if (fillStatus === false) {
          oldData.push(['Some Required Fields are missing']);

          combinedFillStatus = false;
        } else {
          oldData.push(['✅ All Required Fields are full filled']);
          // this.loanApplicationRequiredField.setRequiredFileds('individual_details', oldData);
        }
      });

      if (combinedFillStatus) {
        this.loanApplicationRequiredField.removeRequiredFields('individual_details');
      } else {
        this.loanApplicationRequiredField.setRequiredFileds('individual_details', oldData);
        // this.loanApplicationRequiredField.setRequiredFileds('individual_details', oldData);
      }
    }

    console.log('combine values is: ', combinedFillStatus);

    if (combinedFillStatus) {
      this.loanApplicationRequiredField.removeRequiredFields('individual_details');
      console.log('after removing: ');
    }

    if (this.individualLoanApplicationDetails.length === 0) {
      this.loanApplicationRequiredField.setRequiredFileds('individual_details', [
        ['Individual details need to fill'],
      ]);
    }
  }

  private getLegalPersonaLoanApplicationDetails(loanApplicationData: LoanApplicationDataModel) {
    if (this.loanType.toLowerCase() === 'individual') {
      return;
    }
    this.legalPersonaLoanApplicationDetails = loanApplicationData?.loanLegalPersona;

    if (!this.legalPersonaLoanApplicationDetails) {
      this.legalPersonaLoanApplicationDetails = {};
    }

    let fillStatus = this.legalPersonaLoanApplicationDetails.fillStatus;

    let companyRequiredFieldsMap = RequiredCompanyFields;
    let companyRequiredFields: any[] = [];
    let comapnyRequiredFieldControlName = Object.keys(companyRequiredFieldsMap);
    for (let i = 0; i < comapnyRequiredFieldControlName.length; i++) {
      let currentReqiredControlName: any = comapnyRequiredFieldControlName[i];
      let currentControlValue = this.legalPersonaLoanApplicationDetails[currentReqiredControlName];

      if (
        this.loanType.toLowerCase() === 'group' &&
        currentReqiredControlName === 'registrationNumber'
      ) {
        currentControlValue = 'BW123232 Random Value';
      }
      if (
        currentControlValue !== null &&
        currentControlValue !== undefined &&
        currentControlValue.includes('-')
      ) {
        // skipping mobile country code
        let splittedValues = currentControlValue.split('-');

        currentControlValue = splittedValues[1];
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
      this.loanApplicationRequiredField.setRequiredFileds('company_details', companyRequiredFields);
    } else if (fillStatus === false) {
      this.loanApplicationRequiredField.setRequiredFileds('company_details', [
        'Details are not filled, please fill the all required field to continue',
      ]);
    } else {
      this.loanApplicationRequiredField.removeRequiredFields('company_details');
    }
  }

  private getLoanApplicationServiceDetails(loanApplicationData: LoanApplicationDataModel) {
    this.loanApplicationServiceDetails = loanApplicationData?.loanServiceCentre || {};

    let fillStatus = this.loanApplicationServiceDetails?.fillStatus || false;
    let applicationDetailsRequiredFieldsMap = RequiredApplicationDetailsFields;
    let applicationDetailsRequiredFields: any[] = [];
    let applicationDetailsRequiredFieldControlName = Object.keys(
      applicationDetailsRequiredFieldsMap,
    );
    for (let i = 0; i < applicationDetailsRequiredFieldControlName.length; i++) {
      let currentReqiredControlName: any = applicationDetailsRequiredFieldControlName[i];
      // @ts-ignore
      let currentControlValue = this.loanApplicationServiceDetails[currentReqiredControlName];
      if (
        currentControlValue === null ||
        currentControlValue === '' ||
        currentControlValue === undefined
      ) {
        applicationDetailsRequiredFields.push(
          RequiredApplicationDetailsFields[currentReqiredControlName],
        );
      }
    }

    if (applicationDetailsRequiredFields.length > 0) {
      this.loanApplicationRequiredField.setRequiredFileds(
        'application_details',
        applicationDetailsRequiredFields,
      );
    } else if (fillStatus === false) {
      this.loanApplicationRequiredField.setRequiredFileds('application_details', [
        'Some fields are missing, please check the all required fields',
      ]);
    } else {
      this.loanApplicationRequiredField.removeRequiredFields('application_details');
    }
  }

  private getLoanApplicationDocumentDetails(loanApplicationData: LoanApplicationDataModel) {
    this.loanApplicationDocumentDetails = loanApplicationData?.loanDocs;
    console.log('Loan Application Document Details: ', this.loanApplicationDocumentDetails);

    if (!this.loanApplicationDocumentDetails) {
      this.loanApplicationRequiredField.setRequiredFileds('document_details', [
        'please upload all required document to proceed',
      ]);
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

        this.getIndividualLoanApplicationDetails(this.loanApplicationData);
        this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        this.getLoanApplicationServiceDetails(this.loanApplicationData);
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

    // this.loanApplicationEffectService
    //   .fetchCurrentLoanApplication(this.currentApplicationId, true)!
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((loanApplicationDataResponse: any) => {
    //     this.loanApplicationData = loanApplicationDataResponse.data.appDetails;
    //     this.getIndividualLoanApplicationDetails(this.loanApplicationData);
    //     this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
    //     this.getLoanApplicationServiceDetails(this.loanApplicationData);
    //     this.getLoanApplicationDocumentDetails(this.loanApplicationData);

    //     // this.cdr.markForCheck();
    //   });
    // this.currentStep--;
    // update the current step in the router query params
    this.updateQueryParam(this.currentStep$.value);
    this.loanApplicationService
      .getLoanApplicationDetails(this.currentApplicationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loanApplicationDataResponse: any) => {
        this.loanApplicationData = loanApplicationDataResponse.data.appDetails;

        this.getIndividualLoanApplicationDetails(this.loanApplicationData);
        this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        this.getLoanApplicationServiceDetails(this.loanApplicationData);
        this.getLoanApplicationDocumentDetails(this.loanApplicationData);

        this.cdr.detectChanges();
      });
  }

  // ---- LOAN APPLICATION DISCLAIMER ----
  showLoanApplicationDisclaimer(cancelButton: boolean = false) {
    return Swal.fire({
      title: 'Loan Application Disclaimer',
      icon: 'info',
      heightAuto: false,

      html: `

      <p>By clicking <code>Agree and Proceed</code> to Application, you acknowledge that you have read and understood the below disclaimer and agree to its terms.</p>

      <ol class="disclaimer-container text-start d-flex flex-column gap-3 mt-5 text-dark">
  <li>
    This website is for informational purposes only and is not intended to provide specific
    commercial, financial, investment, accounting, tax, or legal advice. It is provided to you
    solely for your own personal, non-commercial use and not for purposes of resale, distribution,
    public display or performance, or any other uses by you in any form or manner whatsoever. Unless
    otherwise indicated on this website, you may display, download, archive, and print a single copy
    of any information on this website, or otherwise distributed from CEDA, for such personal,
    non-commercial use, provided it is done pursuant to the User Conduct and Obligations set forth
    herein.
  </li>

  <li>
    While we have taken care to ensure that the content on this website is accurate, this website
    and the services accessible on or via this website are provided "as is" and your use of and
    reliance on the information on this website and the online services is entirely at your own
    risk. Accordingly, we do not guarantee the accuracy, timeliness, reliability or completeness of
    any of the information contained on, downloaded or accessed from this website.
  </li>

  <li>
    We do not represent or warrant that the website, any tools (such as calculators), software,
    advice, opinion, statement, information, content or online services will be error-free or will
    meet any particular criteria of accuracy, completeness, reliability, performance or quality. You
    acknowledge that any reliance upon any such tools, software, advice, opinion, statement or
    information shall be at your sole risk. We reserve the right, in our sole discretion, to correct
    any errors or omissions in any portion of this website.
  </li>

  <li>
    Information, ideas and opinions expressed on this website should not be regarded as professional
    advice or our official opinion. You are strongly advised to seek professional advice before
    taking any course of action related to them. More specifically, certain information such as
    share price data, interest rates and exchange rates constitute guidelines only and the provision
    of this data may be delayed for a period of time. Accordingly, you are strongly advised to
    consult us or your professional adviser before trading or acting on such information.
  </li>

  <li>
    To the fullest extent permissible by law, we expressly disclaim all (express and implied)
    warranties, including, without limitation, warranties of merchantability, title, and fitness for
    a particular purpose, non-infringement, compatibility, security and accuracy in respect of this
    website and the services accessible on this website. While we take all reasonable precautions to
    prevent this, we do not warrant that the website or any software available for download via the
    website is free of viruses or destructive code.
  </li>

  <li>
    We and our officers, directors, employees, servants, affiliates, shareholders, agents,
    consultants or employees (in whose favour this constitutes a stipulation for the benefit of
    another) shall not be liable for and you hereby indemnify us and our officers, directors,
    employees, servants, affiliates, shareholders, agents, consultants or employees (in whose favour
    this constitutes a stipulation for the benefit of another) against any direct, indirect,
    special, incidental, consequential or punitive damages or loss of any kind whatsoever or
    howsoever caused (whether arising under contract, delict or otherwise and whether the loss was
    actually foreseen or reasonably foreseeable) arising out of your use of this website or the
    online services or the information contained on this website or your inability to use this
    website or the online services.
  </li>

  <li>
    Without derogating from the generality of the above, we will not be liable for

    <ul>
      <li>
        Any interruption, malfunction, downtime or other failure of the website or online services,
        our system, databases or any of its components, for reasons beyond our control;
      </li>
      <li>
        Any loss or damage with regard to customer data or other data directly or indirectly caused
        by malfunction of our system, third party systems, power failures, unlawful access to or
        theft of data, computer viruses or destructive code on our system or third party systems;
        programming defects;
      </li>
      <li>
        Any interruption, malfunction, downtime or other failure of goods or services provided by
        third parties, including, without limitation, third party systems such as the public
        switched telecommunication service providers, internet service providers, electricity
        suppliers, local authorities and certification authorities;
      </li>
      <li>Any event over which we have no direct control.</li>
    </ul>
  </li>

  <li>
    CEDA reserves the right, at its sole discretion, to modify, disable access to or discontinue,
    temporarily or permanently, any part or all of this website or any information contained thereon
    without liability or notice to you.
  </li>
</ol>




              `,
      position: 'center',
      //   showClass: {
      //     popup: `
      //   animate__animated
      //   animate__fadeInRight
      //   animate__faster
      // `,
      //   },
      //   hideClass: {
      //     popup: `
      //   animate__animated
      //   animate__fadeOutRight
      //   animate__faster
      // `,
      //   },
      // grow: 'column',
      width: 700,
      // showCloseButton: true,
      showCancelButton: cancelButton,
      focusConfirm: false,
      focusCancel: false,
      confirmButtonText: 'Agree and Proceed',
      confirmButtonAriaLabel: 'Agree and Proceed',
      customClass: {
        container: 'swal2-custom-container-disclaimer',
        popup: 'swal2-custom-popup-disclaimer',
        htmlContainer: 'swal2-custom-html-container-disclaimer',
        actions: 'swal2-custom-actions-disclaimer',
        confirmButton: 'swal2-custom-confirm-button-disclaimer',
        icon: 'swal2-custom-icon-disclaimer',
        title: 'swal2-custom-title-disclaimer',
        footer: 'swal2-custom-footer-disclaimer',
      },
      backdrop: false,
    }) as Promise<SweetAlertResult>;
  }

  currentClickedItem() {
    // console.log('current Item called');
  }

  onStepChangesTo(index: number) {
    this.currentStep$.next(index);
    this.updateQueryParam(this.currentStep$.value);

    this.loanApplicationService
      .getLoanApplicationDetails(this.currentApplicationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loanApplicationDataResponse: any) => {
        this.loanApplicationData = loanApplicationDataResponse.data.appDetails;

        this.getIndividualLoanApplicationDetails(this.loanApplicationData);
        this.getLegalPersonaLoanApplicationDetails(this.loanApplicationData);
        this.getLoanApplicationServiceDetails(this.loanApplicationData);
        this.getLoanApplicationDocumentDetails(this.loanApplicationData);

        this.cdr.detectChanges();
      });
  }
}

export function showLoanApplicationDisclaimer(cancelButton: boolean = false) {
  return Swal.fire({
    title: 'Loan Application Disclaimer',
    icon: 'info',
    heightAuto: false,
    html: `
      <p>By clicking <code>Agree and Proceed</code> to Application, you acknowledge that you have read and understood the below disclaimer and agree to its terms.</p>'

       <app-loan-disclaimer></app-loan-disclaimer>

              `,
    position: 'center',
    showClass: {
      popup: `
      animate__animated
      animate__fadeInRight
      animate__faster
    `,
    },
    hideClass: {
      popup: `
      animate__animated
      animate__fadeOutRight
      animate__faster
    `,
    },
    // grow: 'column',
    width: 700,
    // showCloseButton: true,
    showCancelButton: cancelButton,
    focusConfirm: false,
    focusCancel: false,
    confirmButtonText: 'Agree and Proceed',
    confirmButtonAriaLabel: 'Agree and Proceed',
    customClass: {
      container: 'swal2-custom-container-disclaimer',
      popup: 'swal2-custom-popup-disclaimer',
      htmlContainer: 'swal2-custom-html-container-disclaimer',
      actions: 'swal2-custom-actions-disclaimer',
      confirmButton: 'swal2-custom-confirm-button-disclaimer',
      icon: 'swal2-custom-icon-disclaimer',
      title: 'swal2-custom-title-disclaimer',
      footer: 'swal2-custom-footer-disclaimer',
    },
    backdrop: false,
  }) as Promise<SweetAlertResult>;
}
