import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationHttpService {
  private loanCreateUrl = environment.apiUrl + '/pfsvc/loan/create';
  private mabogoDinkuLoanCreateUrl = environment.apiUrl + '/pfsvc/md/loan/create';

  private saveIndividualDetailsUrl = environment.apiUrl + '/pfsvc/loan/addIndividuals';
  private saveApplicationDetailsUrl = environment.apiUrl + '/pfsvc/loan/addServiceCentre';

  private saveLegalPersonaDetailsUrl = environment.apiUrl + '/pfsvc/loan/addLegalPersona';

  private uploadDocumentUrl = environment.apiUrl + '/pfsvc/loan/uploadDoc';
  private getDocumentUrl = environment.apiUrl + '/pfsvc/downloadFile';

  private getLoanApplicationDetailsUrl = environment.apiUrl + '/pfsvc/loan/getLoanAppDetails';

  private getAllLoanApplicationUrl = environment.apiUrl + '/pfsvc/loan/getAllLoanApps';

  private submitLoanApplicationUrl = environment.apiUrl + '/pfsvc/loan/submit';

  constructor(private http: HttpClient) {}

  initLoanApplication(selectLoanTypePayload: any) {
    return this.http.post(this.loanCreateUrl, selectLoanTypePayload) as Observable<any>;
  }

  initMabogoDinkuLoanApplication(selectLoanTypePayload: any) {
    return this.http.post(this.mabogoDinkuLoanCreateUrl, selectLoanTypePayload) as Observable<any>;
  }

  saveIndividualLoanApplication(individualDetails: any) {
    return this.http.post(this.saveIndividualDetailsUrl, individualDetails);
  }

  saveIndividualLoanApplicationMabogoDinku(individualDetails: any) {
    let url = environment.apiUrl + '/pfsvc/md/loan/addIndividuals';
    return this.http.post(url, individualDetails);
  }

  saveApplicationDetails(applicationDetails: any) {
    return this.http.post(this.saveApplicationDetailsUrl, applicationDetails);
  }

  saveApplicationDetailsMabogoDinku(applicationDetails: any) {
    let url = environment.apiUrl + '/pfsvc/md/loan/addServiceCentre';
    return this.http.post(url, applicationDetails);
  }

  saveLegalPersona(legapPersonaDetails: any) {
    return this.http.post(this.saveLegalPersonaDetailsUrl, legapPersonaDetails);
  }

  saveLegalPersonaMabogoDinku(legapPersonaDetails: any) {
    let url = environment.apiUrl + '/pfsvc/md/loan/addLegalPersona';
    return this.http.post(url, legapPersonaDetails);
  }

  uploadDocuments(uploadDocumentsPayload: any) {
    return this.http.post(this.uploadDocumentUrl, uploadDocumentsPayload, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getDocument(documentId: string) {
    return this.http.get(this.getDocumentUrl + '/' + documentId, {
      responseType: 'blob' as 'json',
    });
  }

  getLoanApplicationDetails(getApplicationDetailsPayload: any) {
    return this.http.post(this.getLoanApplicationDetailsUrl, getApplicationDetailsPayload);
  }

  getLoanApplicationDetailsMabogoDinku(getApplicationDetailsPayload: any) {
    let url = environment.apiUrl + '/pfsvc/md/loan/getLoanAppDetails';
    return this.http.post(url, getApplicationDetailsPayload);
  }

  getAllLoanApplication(payload: any): Observable<any> {
    return this.http.post(this.getAllLoanApplicationUrl, payload);
  }

  submitLoanApplication(submitApplicationPayLoad: any) {
    return this.http.post(this.submitLoanApplicationUrl, submitApplicationPayLoad);
  }
}
