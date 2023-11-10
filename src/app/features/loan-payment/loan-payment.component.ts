import { AsyncPipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { HttpLoaderService } from '../../core/services/http-loader.service';
import { SecureStorageService } from '../../core/services/secure-storage.service';
import { DisclaimerService } from '../../shared/data-access/disclaimer.service';
import { ClickableDirective } from '../../shared/ui/directives/dom-event-directives/clickable-button.directive';
import { CustomValidators } from '../../shared/utils/custom-validators';
import { LoanPaymentService } from './services/loan-payment.service';
import { DecimalInputDirective } from './utils/decimal-input.directive';

@Component({
  selector: 'app-loan-payment',
  templateUrl: './loan-payment.component.html',
  styleUrls: ['./loan-payment.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,

  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    NgIf,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    ClickableDirective,
    DecimalInputDirective,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [DecimalPipe],
})
export class LoanPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  paymentModes = ['Credit Card', 'Debit Card', 'Net Banking'];
  loanTypes = ['Personal Loan', 'Car Loan', 'Home Loan', 'Education Loan'];

  loanAmount: string;
  loanNumber: string;
  arrears: string;
  balance: string;

  installment: string;

  payableAmount: string | number;

  @ViewChild('hiddenSubmitButton') hiddenSubmitButton: HTMLInputElement;

  @ViewChild('form') form: ElementRef;
  @ViewChild('inputChecksum') inputChecksum: ElementRef;
  @ViewChild('inputPayRequestId') inputPayRequestId: ElementRef;

  encRequest: String;
  accessCode: String;

  PAY_REQUEST_ID: String;
  CHECKSUM: String;

  public payableAmountControl: FormControl = new FormControl('', {
    validators: [Validators.required, Validators.min(1)],
    updateOn: 'blur',
  });

  constructor(
    private fb: FormBuilder,
    private paymentService: LoanPaymentService,
    // private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: SecureStorageService,
    public loader: HttpLoaderService,
    private toastr: ToastrService,
    private decimalPipe: DecimalPipe,
    private destroyRef: DestroyRef,
    private disclaimerService: DisclaimerService,
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      loanType: ['', Validators.required],
      loanAmount: ['', [Validators.required, Validators.min(1)]],
      paymentMode: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cvv: ['', Validators.required],
    });

    this.loanNumber = this.activatedRoute.snapshot.queryParamMap.get('loanNumber')!;
    this.loanAmount = this.activatedRoute.snapshot.queryParamMap.get('loanAmount')!;
    this.arrears = this.activatedRoute.snapshot.queryParamMap.get('arrears')!;
    this.balance = this.activatedRoute.snapshot.queryParamMap.get('balance')!;
    this.installment = this.activatedRoute.snapshot.queryParamMap.get('installment')!;

    // // console.log('loanNumber', this.loanNumber);
    // // console.log('loanAmount', this.loanAmount);
    // // console.log('arrears', this.arrears);
    // // console.log('balance', this.balance);

    this.storage.set('loanNumber', this.loanNumber);
    this.storage.set('loanAmount', this.loanAmount);
    this.storage.set('arrears', this.arrears);
    this.storage.set('balance', this.balance);
    this.storage.set('installment', this.installment);
    this.payableAmountControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const formatedValue = this.getDecimalValue(value);
        this.payableAmountControl.setValue(formatedValue, { emitEvent: false });
        // console.log('formated value', formatedValue);
      });
  }

  hiddenForm: FormGroup = new FormGroup({
    PAY_REQUEST_ID: new FormControl(''),
    CHECKSUM: new FormControl(''),
  });

  payFullOrCustom(event: boolean) {
    if (event) {
      // this.payableAmount = +this.arrears;
      this.payableAmount = 0;
    } else {
      this.payableAmount = 0;
    }
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.paymentService.submitPayment(this.paymentForm.value);
    }
  }

  confirmLoanV2() {
    this.paymentService.confirmLoan(this.loanNumber, this.payableAmount.toString());
  }

  isNumericKeyPress(event: any) {
    if (
      this.payableAmount?.toString().startsWith('0') ||
      (this.payableAmount?.toString().startsWith('+') &&
        this.payableAmount?.toString().length === 2 &&
        this.payableAmount?.toString()[1] === '0')
    ) {
      this.toastr.error('Amount can not start with zero', 'Error');
      this.payableAmount = 0;
      return false;
    }

    if (this.payableAmount?.toString().startsWith('-')) {
      this.toastr.error('Amount can not be negative', 'Error');
      this.payableAmount = 0;
      return false;
    }

    // const payableAmount = this.payableAmount?.toString().replace(/[+-]/, '');
    // if (payableAmount && payableAmount.toString() > this.arrears.toString()) {
    //   this.toastr.error('Amount can not be greater than arrears', 'Error');
    //   return false;
    // }

    return CustomValidators.isNumericKeyPress(event);
  }

  onPayableAmountChange(event: any) {
    const value = event.target.value;
    // console.log('value', value);

    const formatedValue = this.getDecimalValue(value);
    this.payableAmount = formatedValue;
  }

  async confirmLoan() {
    if (this.payableAmountControl.invalid) {
      this.toastr.error('Please enter valid amount', 'Error');
      return;
    }

    let response: any = await lastValueFrom(
      this.paymentService.confirmLoanV2(
        this.loanNumber,
        this.payableAmountControl.getRawValue().toString().replace(/,/g, ''),
      ),
    );

    this.storage.set('payableAmount', this.getDecimalValue(this.payableAmount.toString()));
    // this.storage.set('payableContractNumber', this.loanNumber);
    // this.storage.set('payableRequestId', response.data.PAY_REQEUST_ID);

    this.hiddenForm.get('PAY_REQUEST_ID')?.setValue(response.data.PAY_REQUEST_ID);
    this.hiddenForm.get('CHECKSUM')?.setValue(response.data.CHECKSUM);

    // this.hiddenSubmitButton.click();

    this.PAY_REQUEST_ID = response.data.PAY_REQUEST_ID;
    this.CHECKSUM = response.data.CHECKSUM;

    // // console.log('PAY_REQUEST_ID', this.PAY_REQUEST_ID);
    // // console.log('CHECKSUM', this.CHECKSUM);

    this.inputChecksum.nativeElement.value = this.CHECKSUM;
    this.inputPayRequestId.nativeElement.value = this.PAY_REQUEST_ID;

    // // console.log('form: ', this.form.nativeElement);
    this.form.nativeElement.submit();
    // // console.log('form submit', this.form.nativeElement.submit());
  }

  getDecimalValue(value: string) {
    const numericValue = parseFloat(value.replace(/,/g, '')); // Remove existing commas
    return this.decimalPipe.transform(numericValue, '1.2')?.toString() || '';
  }

  @ViewChild('disclaimer1') disclaimerCheckbox: ElementRef<HTMLInputElement>;
  isConfirmBtnDisable: boolean = true;

  disclaimerChanged(event: any) {
    this.isConfirmBtnDisable = !event;
  }

  openPaymentDisclaimer() {
    this.disclaimerService
      .showLoanPaymentDisclaimer('Loan Payment Terms and Agreement', true)
      .then((result) => {
        if (result.isConfirmed) {
          this.disclaimerCheckbox.nativeElement.checked = true;
          this.disclaimerChanged(this.disclaimerCheckbox.nativeElement.checked);
        } else {
          this.disclaimerCheckbox.nativeElement.checked = false;
          this.disclaimerChanged(this.disclaimerCheckbox.nativeElement.checked);
        }
      });
  }
}
