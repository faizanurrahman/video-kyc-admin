import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

export interface DeleteLoanApplicationPayloadInterface {
  applicationId: string;
  sessionId: string;
  prDelReason: string;
  scDelReason: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteLoanApplicationService {
  constructor(private http: HttpClient) {}

  deleteLoanApplication(payLoad: DeleteLoanApplicationPayloadInterface) {
    const urls = environment.apiUrl + '/pfsvc/loan/delete';
    return this.http.post(urls, payLoad, {});
  }
}
