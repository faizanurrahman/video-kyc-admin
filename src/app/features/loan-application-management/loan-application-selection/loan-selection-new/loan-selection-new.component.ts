import { AsyncPipe, LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BehaviorSubject, first } from 'rxjs';
import { HttpLoaderService } from '../../../../core/services/http-loader.service';
import { LoaderComponent } from '../../../../shared/ui/components/loader/loader.component';
import { LoanApplicationTypeEnum } from '../../models/loan-application.enum';
import { LoanApplicationService } from '../../services/loan-application.service';
import { SelectionCardComponent } from './selection-card/selection-card.component';

interface LoanInitResponse {
  status: string;
  statusCode: string;
  statusDesc: string;
  decisionPageRequired: boolean;
  data: {
    applicationId: string;
  };
}

@Component({
  selector: 'app-loan-selection-new',
  standalone: true,
  imports: [
    NgIf,
    InlineSVGModule,
    ReactiveFormsModule,
    SelectionCardComponent,
    FormsModule,

    NgFor,
    NgClass,

    LoaderComponent,
    AsyncPipe,
    LowerCasePipe,
    RouterLink,
  ],
  templateUrl: './loan-selection-new.component.html',
  styleUrls: ['./loan-selection-new.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanSelectionNewComponent {
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  loanSelectionForm: FormGroup;
  loanSelectionPayload: any;
  loanApplicationType: LoanApplicationTypeEnum[];
  loanApplicationSector: string;
  loanApplicationProductType: string;

  get loanType() {
    return this.loanSelectionForm.get('loanType');
  }

  // private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private activatedRoute: ActivatedRoute,
    private loanApplicationService: LoanApplicationService,
    // private tostr: ToastrService,
    public loaderService: HttpLoaderService,
    private destroyRef: DestroyRef,
  ) {
    this.initLoanSelectionForm();

    this.loanApplicationType = [
      LoanApplicationTypeEnum.individual,
      LoanApplicationTypeEnum.company,
      LoanApplicationTypeEnum.group,
      LoanApplicationTypeEnum.mabogoDinku,
    ];
  }

  ngOnDestroy() {}

  initLoanSelectionForm() {
    this.loanSelectionForm = this.fb.group(
      {
        loanType: ['', Validators.required],
        loanSector: ['', Validators.required],
        loanProductType: ['', Validators.required],
      },
      { updateOn: 'change' },
    );

    this.loanApplicationSector = this.loanApplicationService.loanApplicationSector!;
    this.loanApplicationProductType = this.loanApplicationService.loanApplicationProductType!;

    this.loanSelectionForm.patchValue({
      loanSector: this.loanApplicationSector,
      loanProductType: this.loanApplicationProductType,
    });
  }

  onLoanTypeSelection(selectedLoanType: any) {
    this.loanSelectionForm.patchValue({
      loanType: selectedLoanType,
    });

    this.onSubmit();
  }

  onSubmit() {
    const loanType = this.loanSelectionForm.value.loanType;
    const sector = this.loanSelectionForm.value.loanSector;
    const productType = this.loanSelectionForm.value.loanProductType;

    this.loading$.next(true);
    this.loanApplicationService
      .initLoanApplication(loanType, sector, productType)
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      // todo: need to fix this
      // I have to intermediate loader before moving to the next page

      .subscribe((res: LoanInitResponse) => {
        this.router.navigate(['/loan-application-management/init'], {
          queryParams: {
            sectorType: sector,
            productType: productType,
            loanType: loanType,
            applicationId: res.data.applicationId,
            currentStep: 1,
          },
        });

        this.loading$.next(false);
      });
  }
}
