import { AsyncPipe, DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { HttpLoaderService } from '../../core/services/http-loader.service';
import { UserDataService } from '../../core/services/user-data.service';
import { ActiveLoan } from './models/active-loans.model';
import { LoanStatement } from './models/loan-statements.model';
import { ActiveLoanService } from './services/active-loan.service';
import { LoanStatementEffectService } from './services/loan-statement-effect.service';
import { LoanStatementStateService } from './services/loan-statement-state.service';
import { LoanStatementService } from './services/loan-statement.service';

@Component({
  selector: 'app-loan-statements',
  templateUrl: './loan-statements.component.html',
  styleUrls: ['./loan-statements.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    BsDatepickerModule,
    AsyncPipe,
    DatePipe,
  ],
  providers: [DatePipe, DecimalPipe],
})
export class LoanStatementsComponent implements OnInit, OnDestroy {
  // private subs: Subscription[] = [];

  @ViewChild('startDate') startDatePicker: BsDatepickerDirective;
  @ViewChild('endDate') endDatePicker: BsDatepickerDirective;

  endDateBsConfig: Partial<BsDatepickerConfig> = {};
  startDateBsConfig: Partial<BsDatepickerConfig> = {};

  @Input() cssClass: '';
  currentTab = 'Day';

  tabIndex: number = 1;

  activeLoans: ActiveLoan[];
  currentLoanNumber: string;
  currentLoanStatement: LoanStatement;

  searchStatementForm: FormGroup;
  searchStatementFormSubmitted: boolean = false;

  public exportStatementPdfUrl = environment.apiUrl2 + '/accsvc/generatestatement?sessionId=';

  get fc() {
    return this.searchStatementForm.controls;
  }

  constructor(
    private activeLoanService: ActiveLoanService,
    private loanStatementService: LoanStatementService,
    private cdr: ChangeDetectorRef,
    public loader: HttpLoaderService,
    private datePipe: DatePipe,
    private userDataService: UserDataService,
    private destroyRef: DestroyRef,
    private decimalPipe: DecimalPipe,
    private loanStatementStateService: LoanStatementStateService,
    private loanStatementEffectService: LoanStatementEffectService,
  ) {
    // initialize search Statement Form
    this.searchStatementFormInit();
  }

  async ngOnInit() {
    this.activeLoanService
      .getActiveLoans()
      .pipe(takeUntilDestroyed(this.destroyRef))

      .pipe(
        switchMap((res: ActiveLoan[]) => {
          this.activeLoans = res;
          if (this.activeLoans === null || this.activeLoans.length === 0) {
            // this.tostr.info('No Active Loans Found', 'INFO');
            return of({} as any);
          }
          this.currentLoanNumber = this.activeLoans[0].accountNo;
          this.searchStatementForm.patchValue({
            loanNumber: this.currentLoanNumber,
          });
          return this.loanStatementService.getLoanStatementByLoanNumber(this.currentLoanNumber);
        }),
      )

      .subscribe((statements: LoanStatement) => {
        this.currentLoanStatement = statements;

        this.cdr.detectChanges();
      });

    this.startDateBsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
        dateOutputFormat: 'YYYY-MM-DD',
        showWeekNumbers: false,
        todayHighlight: true,
        selectTodayOnClick: true,
        showTodayButton: false,
        customTodayClass: 'today',
        outsideClick: true,
        maxDate: new Date(),
        adaptivePosition: true,
      },
    );

    this.endDateBsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
        dateOutputFormat: 'YYYY-MM-DD',
        showWeekNumbers: false,

        todayHighlight: true,
        maxDate: new Date(),

        selectTodayOnClick: true,
        showTodayButton: false,
        customTodayClass: 'today',
        outsideClick: false,
        adaptivePosition: true,
      },
    );

    const userData = this.userDataService.getUserData();
    this.exportStatementPdfUrl += userData.sessionId.toString();
    // console.log('export statement pdf url: ', this.exportStatementPdfUrl);
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    // flatpickr(this.flatpickr.nativeElement, this.flatpickrOptions);
    // testing purpose
    this.searchStatementForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        // // console.log('form value', res);
        this.searchStatementFormSubmitted = false;
      });

    this.searchStatementForm
      .get('startDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        // // console.log('startDate', this.datePipe.transform(res, 'yyyy-MM-dd'));
        this.startDatePicker.bsValue = res;
        this.endDateBsConfig.minDate = res;
      });

    this.searchStatementForm
      .get('endDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        if (res === null || res === '') {
          this.endDatePicker.bsValue = new Date();
          return;
        }
        // // console.log('endDate', res);
        this.endDatePicker.bsValue = res;
      });
  }

  ngOnDestroy() {}

  private searchStatementFormInit() {
    this.searchStatementForm = new FormGroup(
      {
        loanNumber: new FormControl('', [Validators.required]),
        statementType: new FormControl('MS'),
        startDate: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
      },
      { updateOn: 'change' },
    );
  }

  public async onFindLoanStatement() {
    this.searchStatementFormSubmitted = true;

    const loanNumber: string = this.searchStatementForm.get('loanNumber')?.value;
    const statementType: any = this.searchStatementForm.get('statementType')?.value;
    const startDate: any = this.datePipe.transform(
      this.searchStatementForm.get('startDate')?.value,
      'yyyy-MM-dd',
    );
    const endDate: any = this.datePipe.transform(
      this.searchStatementForm.get('endDate')?.value,
      'yyyy-MM-dd',
    );
    let statement: any = '';

    if (this.searchStatementForm.invalid) {
      return;
    }

    if (startDate === '' || endDate === '') {
      statement = await lastValueFrom(
        this.loanStatementService.getLoanStatementByLoanNumber(loanNumber),
      );
    } else {
      statement = await lastValueFrom(
        this.loanStatementService.getLoanStatementByLoanNumber(
          loanNumber,
          statementType,
          startDate,
          endDate,
        ),
      );
    }

    this.searchStatementFormSubmitted = false;

    this.currentLoanStatement = statement;
  }

  onActiveLoanChange(event: any) {
    this.loanStatementService
      .getLoanStatementByLoanNumber(this.currentLoanNumber)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: LoanStatement) => {
        this.currentLoanStatement = res;

        this.cdr.detectChanges();
      });
  }

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }

  async getLoanStatementByLoanNumber(loanNumber: string) {
    const statement$ = await lastValueFrom(
      this.loanStatementService.getLoanStatementByLoanNumber(loanNumber),
      {
        defaultValue: {},
      },
    );
    return statement$;
  }

  async getActiveLoans() {
    const activeLoans$ = await lastValueFrom(this.activeLoanService.getActiveLoans());
    return activeLoans$;
  }

  getDecimalValue(value: string) {
    const numericValue = parseFloat(value.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }
}
