import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { UserDataService } from '../../../core/services/user-data.service';
import { IbUserModel } from '../../../modules/auth/models/ib-user.model';
import { LoanPaymentRequestPayload } from '../models/loan-payment-request-payload';
import { LoanPaymentResponsePayload } from '../models/loan-payment-response-payload';

@Injectable({
  providedIn: 'root',
})
export class LoanPaymentService {
  private apiUrlStartCardPayment = environment.apiUrl2 + '/accsvc/startCardPayment';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private userData: UserDataService,
  ) {}

  submitPayment(paymentInfo: any) {
    this.http.post(this.apiUrlStartCardPayment, paymentInfo).subscribe({
      next: (res: any) => {
        window.location.href = res.redirectUrl;
        this.toastr.success('Payment Successful', 'Success');
      },
      error: (error: any) => {
        this.toastr.error('Payment Failed', 'Error');
        // // console.log(error);
      },
    });
  }

  confirmLoan(loanNumber: string, loanAmount: string) {
    const userData: IbUserModel = this.userData.getUserData();
    const loginId = userData.genericServiceBean.newLoginBean.loginId;
    const sessionId = userData.sessionId;

    const requestPayload: LoanPaymentRequestPayload = {
      newLoginBean: {
        loginId: loginId,
        transactionId: '1234567890',
      },
      serviceName: 'IB_CARD_PAYMENT',
      requestId: '1234567890',
      sessionId: sessionId,
      data: {
        CARD_WAMOUNT: loanAmount,
        LOAN_ACCT: loanNumber,
      },
    };

    /*
    header: {
        'Content-Type': 'application/json',
        'channel': 'IBCustomer',
        'inst': '1'
      }
    */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'channel': 'IBCustomer',
      'inst': '1',
    });

    this.http
      .post(this.apiUrlStartCardPayment, requestPayload, {
        headers: headers,
      })
      .subscribe({
        next: (res: any) => {
          const response = res as LoanPaymentResponsePayload;
          this.toastr.success('Loan Confirmed', 'Success');

          setTimeout(() => {
            const formData = new FormData();
            formData.append('PAY_REQUEST_ID', response.data.PAY_REQUEST_ID);
            formData.append('CHECKSUM', response.data.CHECKSUM);
            this.http
              .post('https://secure.paygate.co.za/payweb3/process.trans', formData, {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },

                responseType: 'text',
              })
              .subscribe({
                next: (successResponse: any) => {
                  // window.location.href =
                  //   'data:text/html;charset=utf-8,' +
                  //   encodeURIComponent(successResponse);
                  // window.location.href =
                  //   'https://secure.paygate.co.za/payweb3/process.trans';
                  // // console.log(successResponse);
                  //   Swal.fire({
                  //     title: 'Payment Successful',
                  //     text: 'Your loan has been confirmed',
                  //     icon: 'success',
                  //     html: `<a href="${successResponse.redirectUrl}" target="_blank">Click here to view your loan</a>
                  // <br>
                  // `,
                  //   });
                },
                error: (errorResponse: any) => {
                  // // console.log(errorResponse);
                },
              });
          }, 1000);
        },
        error: (error: any) => {
          this.toastr.error('Loan Confirmation Failed', 'Error');
          // // console.log(error);
        },
      });
  }

  confirmLoanV2(loanNumber: string, loanAmount: string) {
    const userData: IbUserModel = this.userData.getUserData();
    const loginId = userData.genericServiceBean.newLoginBean.loginId;
    const sessionId = userData.sessionId;

    const requestPayload: LoanPaymentRequestPayload = {
      newLoginBean: {
        loginId: loginId,
        transactionId: '1234567890',
      },
      serviceName: 'IB_CARD_PAYMENT',
      requestId: '1234567890',
      sessionId: sessionId,
      data: {
        CARD_WAMOUNT: loanAmount,
        LOAN_ACCT: loanNumber,
      },
    };

    /*
    header: {
        'Content-Type': 'application/json',
        'channel': 'IBCustomer',
        'inst': '1'
      }
    */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'channel': 'IBCustomer',
      'inst': '1',
    });

    return this.http.post(this.apiUrlStartCardPayment, requestPayload, {
      headers: headers,
    });
  }

  handleCallback() {
    const paymentId = window.location.search.split('=')[1];
    this.http.get(`${this.apiUrlStartCardPayment}/${paymentId}`).subscribe({
      next: (res: any) => {
        // update UI with payment status

        this.toastr.success('Payment Successful, update UI', 'Success');
      },
      error: (error: any) => {
        this.toastr.error('Payment Failed, update UI', 'Error');
        // // console.log(error);
      },
    });
  }
}
