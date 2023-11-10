import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AccordionModule } from 'primeng/accordion';
import { Message, MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpLoaderService } from '../../../../../../core/services/http-loader.service';
import { SweetAlertService } from '../../../../../../core/services/sweet-alert.service';
import { ClickableDirective } from '../../../../../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { LoanApplicationStateService } from '../../../../services/loan-application-state.service';
import { LoanApplicationService } from '../../../../services/loan-application.service';
import { LoanApplicationCompanyOrGroupModel } from '../../../company-or-group-details/loan-application-company-or-group.interface';
import { NewLoanDocsModel } from '../../../document-details-form-updated/document-model';
import { IndividualDetailsModel } from '../../../individual-form/individual-form.model';
import { ReviewBasicDetailsComponent } from '../../../loan-application-review/components/review-basic-details/review-basic-details.component';
import { ReviewCompanyGroupDetailsComponent } from '../../../loan-application-review/components/review-company-group-details/review-company-group-details.component';
import { ReviewDocumentsDetailsComponent } from '../../../loan-application-review/components/review-documents-details/review-documents-details.component';
import { ReviewIndividualDetailsComponent } from '../../../loan-application-review/components/review-individual-details/review-individual-details.component';
import { ReviewServiceCenterDetailsComponent } from '../../../loan-application-review/components/review-service-center-details/review-service-center-details.component';
import { pdfMakeImagesUtils } from '../../../loan-application-review/pdfMakeImages.utils';
import { MabogoDinkuApplicationFormService } from '../../mabogo-dinku-application-wizard/mabogo-dinku-application-form.service';
import { MabogoDinkuApplicationDetailsModel } from '../../models/mabogo-dinku-application-details-model';
import { MabogoDinkuApplicationDataModel } from '../../models/mabogo-dinku-application-model';
import { MabogoDinkuApplicationRequiredFields } from '../../services/mabogo-dinku-application-required-fields.service';
import { ReviewApplicationDetailsMabogoDinkuComponent } from './review-application-details-mabogo-dinku/review-application-details-mabogo-dinku.component';
//@ts-ignore
pdfMake.vfs = pdfFonts.pdfMake.vfs;

type LoanApplicationStep =
  | 'company_details'
  | 'application_details'
  | 'individual_details'
  | 'document_details';
@Component({
  selector: 'app-mabogo-dinku-review-application',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    NgFor,
    RouterLink,
    AsyncPipe,
    JsonPipe,
    ReviewBasicDetailsComponent,
    ReviewCompanyGroupDetailsComponent,
    ReviewDocumentsDetailsComponent,
    ReviewIndividualDetailsComponent,
    ReviewServiceCenterDetailsComponent,
    ClickableDirective,
    PanelModule,
    NgbTooltipModule,
    MessagesModule,
    AccordionModule,
    FieldsetModule,
    ReviewApplicationDetailsMabogoDinkuComponent,
  ],
  providers: [MessageService],
  templateUrl: './mabogo-dinku-review-application.component.html',
  styleUrls: ['./mabogo-dinku-review-application.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MabogoDinkuReviewApplicationComponent {
  requiredFieldAlertMessage: Message[] | undefined;
  requiredFieldNotificationVisible: boolean = false;

  requiredFieldsForApplication: { [key: string]: any }[];

  loanApplicationData: MabogoDinkuApplicationDataModel;

  @Output() reviewDetailsValidityAndProgress: EventEmitter<{
    validity: boolean;
    progress: number;
  }> = new EventEmitter<{ validity: boolean; progress: number }>();

  @Input() loanApplicationType: string;
  @Input() loanApplicationStatus: string;
  @Input() loanApplicationId: string;
  @Input() loanApplicationSector: string;
  @Input() loanApplicationProductType: string;

  @ViewChild('menuRef') menuRef: ElementRef;
  @ViewChildren('menuItem') menuItems: QueryList<ElementRef>;

  isPdfGenerating: boolean = false;

  @Output()
  public nextStepMove: any = new EventEmitter<any>();
  @Output()
  public previousStepMove: any = new EventEmitter<any>();

  activeAccordion = 0;

  loading$: Observable<boolean>;
  public applicationId: any;

  public isApplicationDisabled = false;

  public isSubmitDisabled: boolean = true;

  // ===================== Getter and Setter ==========================
  get loanBasicDetails() {
    return this.loanApplicationData?.loanBasicDetails;
  }

  get loanIndividualDetails() {
    return this.loanApplicationData?.loanIndividualDetails;
  }

  get loanLegalPersona() {
    return this.loanApplicationData?.loanLegalPersona;
  }

  get loanServiceCentre() {
    return this.loanApplicationData?.loanServiceCentre!;
  }

  get loanDocs() {
    return this.loanApplicationData?.loanDocs;
  }

  // ====================================

  individualRequiredFields: any[] = [];
  companyRequiredFields: any[] = [];
  applicationRequiredFields: any[] = [];
  documentRequiredFields: any[] = [];

  errorIsVisible: boolean = false;

  private mabogoDinkuApplicationFormService = inject(MabogoDinkuApplicationFormService);

  constructor(
    private cdr: ChangeDetectorRef,
    private loader: HttpLoaderService,
    private activatedRoute: ActivatedRoute,
    private loanService: LoanApplicationService,
    private loanStatusService: LoanApplicationStateService,
    private router: Router,
    private tostr: ToastrService, // private renderer: Renderer2, // private el: ElementRef
    private destroyRef: DestroyRef,
    public loanApplicationReqiredField: MabogoDinkuApplicationRequiredFields,
  ) {
    this.loanApplicationReqiredField.requiredFieldsArray$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any[]) => {
        res.forEach((item: any) => {
          console.log('************************************************************');
          console.log('response recieved', res);
          if (item.step === 'individual_details') {
            console.log('individual items got: ', item);
            this.errorIsVisible = true;
            this.individualRequiredFields = item?.fields || [];
          } else if (item.step === 'company_details') {
            this.companyRequiredFields = item?.fields || [];
            this.errorIsVisible = true;
          } else if (item.step === 'application_details') {
            this.applicationRequiredFields = item?.fields || [];
            this.errorIsVisible = true;
          } else if (item.step === 'document_details') {
            this.documentRequiredFields = item?.fields || [];
            this.errorIsVisible = true;
          }
        });

        if (res.length === 0) {
          this.errorIsVisible = false;
        } else {
          console.log('response is: ', res);
        }
      });

    this.loading$ = this.loader.loading$;
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get('applicationId')!;

    // // console.log('loan application review created');
  }

  ngOnInit() {
    // // console.log('review application data', this.loanApplicationData);

    this.loanApplicationType = this.activatedRoute.snapshot.queryParamMap.get('loanType')!;

    this.loanService
      .getLoanApplicationDetailsMabogoDinku(this.applicationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        // // console.log('loan application details', res);
        this.loanApplicationData = res.data.appDetails;
        // console.log('response in reivew application: ', res);

        this.cdr.markForCheck();
      });

    this.loanStatusService.currentLoanStatus$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        // console.log('current status coming in review component', res);
        this.isApplicationDisabled =
          res === 'SUBMITTED' ||
          res === 'APPROVED' ||
          res === 'ACCEPTED' ||
          res === 'REJECTED' ||
          res === 'RESUBMITTED';

        if (this.isApplicationDisabled) {
          this.reviewDetailsValidityAndProgress.emit({
            validity: true,
            progress: this.firstDisclaimerChecked ? 100 : 0,
          });
        }
      });

    this.requiredFieldAlertMessage = [
      {
        severity: 'error',
        summary: '',
        detail:
          // eslint-disable-next-line max-len
          'We noticed that some required fields in the form have not been filled out yet. To ensure the successful completion of your submission, please carefully review each step of the form and make sure to fill in all the required fields. These fields are marked with an asterisk (*) and must be completed for your submission to be processed accurately.',
      },
    ];
  }

  ngAfterViewInit() {
    this.initMenuItems();
  }

  ngOnDestroy() {
    // // console.log('loan application review destroyed');
  }

  private initMenuItems() {
    this.menuItems.forEach((item, index) => {
      item.nativeElement.addEventListener('click', () => {
        // select parent element

        if (item.nativeElement.parentElement.classList.contains('show')) {
          item.nativeElement.parentElement.classList.remove('show');
        } else {
          item.nativeElement.parentElement.classList.add('show');
        }
        this.cdr.markForCheck();
      });
    });
  }

  generatePDF() {
    this.isPdfGenerating = true;

    // define document definition object
    const documentDefinition = {
      background: function (currentPage: any) {
        if (currentPage === 1) {
          return [
            {
              image: 'background',
              height: 120,
              opacity: 0.2,
            },
            // {
            //   image: 'pattern',
            //   margin: [-200, 0],
            //   height: 300,
            // },
          ];
        } else {
          return [
            // {
            //   image: 'pattern',
            //   margin: [-200, 0],
            //   height: 300,
            // },
          ];
        }
      },

      content: this.getPDFDocumentContent(),
      styles: {
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
          padding: [10, 10, 10, 10],
          background: '#333',
          color: '#eee',
          alignment: 'center',
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5],
          background: '#ddd',
          color: '#fff',
          alignment: 'center',
        },
        label: {
          fontSize: 10,
          bold: true,
          margin: [0, 5, 0, 5],
        },
        value: {
          fontSize: 10,
          margin: [0, 5, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 15,
        },
        tableValue: {
          fontSize: 14,
          bold: false,
        },
      },
      images: {
        logo: pdfMakeImagesUtils.logo,
        background: pdfMakeImagesUtils.background,
        pattern: pdfMakeImagesUtils.pattern,
      },
    };

    // generate PDF
    let fileName = this.loanApplicationId + '-' + this.loanApplicationType + '.pdf';

    pdfMake.createPdf(documentDefinition as any).download(fileName);

    setTimeout(() => {
      this.isPdfGenerating = false;
      this.cdr.markForCheck();
    }, 3000);
  }

  public getPDFDocumentContent() {
    let documentContent: any = [];
    // * Add Logo
    documentContent.push(this.generateLoanApplicationLogo());

    // Loan Application Review Header
    documentContent.push({
      columns: [
        {
          text: 'Loan Application Review',
          style: 'header',
          alignment: 'center',
          width: '*',
          margin: [0, 50, 0, 0],
        },
      ],
    });

    // Basic Details
    documentContent.push(
      // basic details section
      {
        text: 'Basic Details',
        style: 'subheader',
        width: '100%',
      },
    );
    documentContent.push(this.generateLoanApplicationBasicDetailsTable());

    documentContent.push({
      text: 'Individual Details',
      style: 'subheader',
    });

    const individualDetails = this.loanIndividualDetails!;
    const size = individualDetails?.length || 0;

    for (let i = 0; i < size; i++) {
      if (this.loanApplicationType.toLowerCase() !== 'individual') {
        documentContent.push({
          text: `Individual ${i + 1}`,
          style: 'subheader',
        });
      }

      documentContent.push(this.generateIndividualDetailsTable(individualDetails[i]));
    }

    if (this.loanApplicationType.toLowerCase() !== 'individual') {
      documentContent.push({
        text: 'Company Details',
        style: 'subheader',
      });

      documentContent.push(this.generateCompanyDetailsTable(this.loanLegalPersona!));
    }

    documentContent.push({
      text: 'Service Center Details',
      style: 'subheader',
    });

    let applicationDetialsArray: MabogoDinkuApplicationDetailsModel[] = this.loanServiceCentre!;

    for (let i = 0; i < size; i++) {
      if (this.loanApplicationType.toLowerCase() !== 'individual') {
        documentContent.push({
          text: `Individual ${i + 1}`,
          style: 'subheader',
        });
      }

      documentContent.push(this.generateServiceDetailsTable(applicationDetialsArray[i]));
    }

    documentContent.push({
      text: 'Document Details',
      style: 'subheader',
    });

    // for (let i = 0; i < size; i++) {
    //   if (this.loanApplicationType.toLowerCase() !== 'individual') {
    //     documentContent.push({
    //       text: `Individual ${i + 1}`,
    //       style: 'subheader',
    //     });
    //   }

    //   documentContent.push(this.generateServiceDetailsTable(applicationDetialsArray[i]));
    // }

    documentContent.push(this.generateDocumentDetailsTable());

    return documentContent;
  }

  private generateLoanApplicationLogo() {
    return {
      alignment: 'justify',
      columns: [
        {
          image: 'logo',
          height: 70,
          width: 100,
          margin: [-10, -20],
          alignment: 'left',
        },
        {
          alignment: 'right',
          stack: [
            'Date: ' + new Date().toLocaleString().split(',').join(' ::'),
            '\n',
            'Powered By: ' + ' Manam Infotech',
          ],
        },
      ],
    };
  }

  private generateLoanApplicationBasicDetailsTable() {
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: [
          [
            { text: 'Application Id', style: 'tableHeader', alignment: 'left' },
            {
              text: this.loanBasicDetails!.applicationId || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Status', style: 'tableHeader', alignment: 'left' },
            {
              text: this.loanBasicDetails!.status || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Created On', style: 'tableHeader', alignment: 'left' },
            {
              text: this.loanBasicDetails!.createdOn || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Updated On', style: 'tableHeader', alignment: 'left' },
            {
              text: this.loanBasicDetails!.updatedOn || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Sector Type', style: 'tableHeader', alignment: 'left' },
            {
              text: this.loanBasicDetails!.sectorType || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Product Type', style: 'tableHeader', alignment: 'left' },
            {
              text: this.loanBasicDetails!.productType || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Application Type',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: this.loanBasicDetails!.loanApplicationType || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
        ],
      },
    };
  }

  private generateIndividualDetailsTable(individualDetails: IndividualDetailsModel) {
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: [
          // Title
          [
            { text: 'Title', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.title || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          // First Name
          [
            { text: 'First Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.fullName || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          // Last Name
          [
            { text: 'Last Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.surname || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Date of birth
          [
            { text: 'Date of Birth', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.dateOfBirth || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Gender
          [
            { text: 'Gender', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.gender || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Marital Status
          [
            { text: 'Gender', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.maritalStatus || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Omang Number
          [
            { text: 'Omang Number', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.omangNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Omang Expirty Date
          [
            { text: 'Omang Expiry', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.dateOfOmangExpiry || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Passport Number
          [
            {
              text: 'Passport Number',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.foreignPassportNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Passport Expiry
          [
            {
              text: 'Passport Expiry Date',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.foreignPassportExpiry || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Nationality
          [
            { text: 'Nationality', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nationality || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Disability
          [
            { text: 'Disability', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.disability || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Disability Type
          [
            {
              text: 'Disability Type',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.disabilityType || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Credit Check
          [
            {
              text: 'Credit Check',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.creditCheck || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Mobile Number
          [
            {
              text: 'Mobile Number',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.mobileNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Secondary Mobile Number
          [
            {
              text: 'Secondary Mobile Number',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.secondaryMobileNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Telephone Number
          [
            {
              text: 'Telephone Number',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.otherContactNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Email Address
          [
            {
              text: 'Email Address',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: individualDetails.emailAddress || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Standard Address
          [
            {
              text: 'Standard Address',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          // Standard Street Address
          [
            {
              text: 'Street Address',
              style: 'tableHeader',
              alignment: 'left',
              colSpan: 2,
            },
            {},
          ],

          // Street Name
          [
            { text: 'Street Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.addrPlot, // fixed: need to get this value from the API
            },
          ],

          // House Number
          [
            { text: 'House Number', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.addrSuburb, // fixed: need to get this value from the API
            },
          ],
          // City
          [
            { text: 'City', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.addrTown, // fixed: need to get this value from the API
            },
          ],
          // Country
          [
            { text: 'Country', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.addrCountry, // fixed: need to get this value from the API
            },
          ],

          // Postal Address
          [
            {
              text: 'Postal Address',
              style: 'tableHeader',
              alignment: 'left',
              colSpan: 2,
            },
            {},
          ],
          // PO Box
          [
            { text: 'PO Box', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.postalAddrPoBox || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // PO Town
          [
            { text: 'Town', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.postalAddrTown || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          // Home Village Address

          [
            {
              text: 'Home Village Address',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          // Standard Street Address
          [
            {
              text: 'Street Address',
              style: 'tableHeader',
              alignment: 'left',
              colSpan: 2,
            },
            {},
          ],

          // Street Name
          [
            { text: 'Street Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.hvAddrPlot, // fixed: need to get this value from the API
            },
          ],

          // House Number
          [
            { text: 'House Number', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.hvAddrSuburb, // fixed: need to get this value from the API
            },
          ],
          // City
          [
            { text: 'Village', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.hvAddrTown, // fixed: need to get this value from the API
            },
          ],
          // Country
          [
            { text: 'Country', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.hvAddrCountry, // fixed: need to get this value from the API
            },
          ],

          // Kin Address

          [
            {
              text: 'Next of Kin Address',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          // Standard Street Address
          [
            {
              text: 'Street Address',
              style: 'tableHeader',
              alignment: 'left',
              colSpan: 2,
            },
            {},
          ],

          //  Name
          [
            { text: 'Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkName, // fixed: need to get this value from the API
            },
          ],

          //  Surname
          [
            { text: 'Surname', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkSurname || 'Not Applicable', // fixed: need to get this value from the API
            },
          ],

          //  Contact
          [
            { text: 'Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkContact, // fixed: need to get this value from the API
            },
          ],

          // Relationship
          [
            { text: 'Relationship', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkRelationship, // fixed: need to get this value from the API
            },
          ],

          // Street Name
          [
            { text: 'Street Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrPlot, // fixed: need to get this value from the API
            },
          ],

          // House Number
          [
            { text: 'House Number', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrSuburb, // fixed: need to get this value from the API
            },
          ],
          // City
          [
            { text: 'City', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrTown, // fixed: need to get this value from the API
            },
          ],
          // Country
          [
            { text: 'Country', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrCountry, // fixed: need to get this value from the API
            },
          ],

          // Kin Address

          [
            {
              text: 'Next of Kin Address 2',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          // Standard Street Address
          [
            {
              text: 'Street Address',
              style: 'tableHeader',
              alignment: 'left',
              colSpan: 2,
            },
            {},
          ],

          // Name 2
          [
            { text: 'Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkName2, // fixed: need to get this value from the API
            },
          ],

          // Name 2
          [
            { text: 'Surname', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkSurname2 || 'Not Applicable', // fixed: need to get this value from the API
            },
          ],

          //  Contact
          [
            { text: 'Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkContact2, // fixed: need to get this value from the API
            },
          ],

          // Relationship
          [
            { text: 'Relationship', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkRelationship2, // fixed: need to get this value from the API
            },
          ],

          // Street Name
          [
            { text: 'Street Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrPlot2, // fixed: need to get this value from the API
            },
          ],

          // House Number
          [
            { text: 'House Number', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrSuburb2, // fixed: need to get this value from the API
            },
          ],
          // City
          [
            { text: 'City', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrTown2, // fixed: need to get this value from the API
            },
          ],
          // Country
          [
            { text: 'Country', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.nkAddrCountry2, // fixed: need to get this value from the API
            },
          ],

          // Business Address

          [
            {
              text: 'Business Address',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],

          // Standard Street Address
          [
            {
              text: 'Street Address',
              style: 'tableHeader',
              alignment: 'left',
              colSpan: 2,
            },
            {},
          ],

          // Street Name
          [
            { text: 'Street Name', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.bussAddrPlot, // fixed: need to get this value from the API
            },
          ],

          // House Number
          [
            { text: 'House Number', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.bussAddrSuburb, // fixed: need to get this value from the API
            },
          ],
          // City
          [
            { text: 'City', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.bussAddrTown, // fixed: need to get this value from the API
            },
          ],
          // Country
          [
            { text: 'Country', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.bussAddrCountry, // fixed: need to get this value from the API
            },
          ],

          // Country
          [
            { text: 'Trading AS', style: 'tableHeader', alignment: 'left' },
            {
              text: individualDetails.bussAddrTradingAs, // fixed: need to get this value from the API
            },
          ],
        ],
      },
    };
  }

  private generateCompanyDetailsTable(companyDetails: LoanApplicationCompanyOrGroupModel) {
    return {
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'Organization Name',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: companyDetails.nameOfOrganization || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Registration Number',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: companyDetails.registrationNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Correspondence Address',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: companyDetails.preferredCorrespondanceAddr || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Postal Address',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          [
            { text: 'PO Box', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.postalAddrPoBox || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Town', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.postalAddrTown || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Business Address',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          [
            { text: 'Street', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.bussAddrPlot || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'City', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.bussAddrDistrict || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Country', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.bussAddrCountry || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],

          [
            { text: 'Bussiness Trading As', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.bussAddrTradingAs || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Primary Contact Details',
              style: 'tableHeader',
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          [
            {
              text: 'Number of Contacts',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: companyDetails.numberOfContacts || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Mobile Number', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.primaryContactMobNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Telephone Number',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: companyDetails.primaryContactOtherContactNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            { text: 'Email Address', style: 'tableHeader', alignment: 'left' },
            {
              text: companyDetails.primaryContactMobNumber || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
        ],
      },
    };
  }

  private generateServiceDetailsTable(serviceCenter: MabogoDinkuApplicationDetailsModel) {
    return {
      table: {
        headerRow: 1,
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'Service Center',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: serviceCenter.branchId || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Application Amount',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: serviceCenter.applicationAmount || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Savings',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: serviceCenter.savings || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
          [
            {
              text: 'Project Description',
              style: 'tableHeader',
              alignment: 'left',
            },
            {
              text: serviceCenter.product || 'Not Applicable',
              style: 'tableValue',
              alignment: 'left',
            },
          ],
        ],
      },
    };
  }

  private generateDocumentDetailsTable(loanDocument: NewLoanDocsModel = {} as NewLoanDocsModel) {
    const tableBody: any = [];
    const documentKeys = this.getDocumentKeys();
    documentKeys.forEach((key) => {
      tableBody.push([
        this.getLoanDocumentName(key),
        {
          text: this.getDocumentValue(key).toString(),
          noWrap: false,
        },
      ]);
    });

    return {
      table: {
        headerRow: 1,
        widths: ['30%', '*'],
        body: tableBody,
      },
    };
  }

  public async previousStep() {
    setTimeout(() => {
      this.previousStepMove.emit(true);
    }, 1000);
  }

  public async nextStep() {
    const isSaved = await this.saveApplication();
    if (isSaved) {
      this.nextStepMove.emit(true);
    } else {
      return;
    }
  }

  saveApplication() {
    this.tostr.success('Application Saved Successfully', 'Success');
    return true;
  }

  private swalService = inject(SweetAlertService);
  submitApplication() {
    if (this.loanIndividualDetails?.length! < 5 || this.loanIndividualDetails?.length! > 15) {
      this.swalService.error(
        'Invalid Shareholders / Individual Details',
        'You must have at least 5 shareholders/Individuals or at max 15',
      );
      return;
    }

    this.loanService.submitLoanApplication(this.applicationId).subscribe((res: any) => {
      if (res.status === 'SUCCESS') {
        Swal.fire({
          title: 'Application Id: ' + this.loanApplicationId,
          text: 'Your Application Submitted Successfully to CEDA Online',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK',
          cancelButtonText: 'No, cancel!',
          heightAuto: false,
          reverseButtons: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/dashboard']);
          }
        });
      } else if (res.status === 'FAILED') {
        Swal.fire({
          title: 'Application Id: ' + this.loanApplicationId,
          heightAuto: false,

          html: `
          <p class="mb-3">Failed to submit application</p>
          <p class='fs-5' style="color: #ff0000"></span> <span class="">${'Atleast one of the OMANG ID should match the Omang ID associated with your BP Number'} </span></p>`,
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'OK',
          cancelButtonText: 'No, cancel!',
          reverseButtons: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/dashboard']);
          }
        });
      } else if (res.status === 'PENDING') {
      }
    });
  }

  firstDisclaimerChecked: boolean = false;
  secondDisclaimerChecked: boolean = false;

  firstDisclaimerChanged(checkValue: boolean) {
    this.firstDisclaimerChecked = checkValue;
    this.disclaimerChange(this.firstDisclaimerChecked, true);
  }

  secondDisclaimerChanged(checkValue: boolean) {
    this.secondDisclaimerChecked = checkValue;
    this.disclaimerChange(this.firstDisclaimerChecked, this.secondDisclaimerChecked);
  }

  disclaimerChange(firstCheckValue: boolean, secondCheckValue: boolean) {
    this.isSubmitDisabled = !firstCheckValue || !secondCheckValue;
    if (!this.isSubmitDisabled) {
      this.reviewDetailsValidityAndProgress.emit({
        validity: true,
        progress: 100,
      });
    } else {
      this.reviewDetailsValidityAndProgress.emit({
        validity: false,
        progress: 0,
      });
    }
  }

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
  }

  public getDocumentValue(key: string): string[] {
    if (this.loanDocs) {
      // @ts-ignore
      const value = this.loanDocs[key];

      // if value is type of array
      if (Array.isArray(value)) {
        return value.map((item) => item.docName);
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
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const generatedMap = new Map<keyof T, string>();

    for (const key of keys) {
      generatedMap.set(key, toTitleCase(key as string));
    }

    return generatedMap;
  }
}
