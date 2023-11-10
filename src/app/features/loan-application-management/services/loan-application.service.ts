import { Injectable } from '@angular/core';
import { IbUserModel } from '@auth/models/ib-user.model';
import { UserDataService } from '@core/services/user-data.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LoanApplicationSectorType } from '../models/loan-application.enum';
import { LoanApplicationHttpService } from './loan-application.http.service';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationService {
  private userDetails: IbUserModel;
  // private subs: Subscription[] = [];

  private readonly _loanApplicationSector: BehaviorSubject<LoanApplicationSectorType> =
    new BehaviorSubject<LoanApplicationSectorType>(null);
  private readonly _loanApplicationProductType: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  public readonly loanApplicationSector$ = this._loanApplicationSector.asObservable();

  public readonly loanApplicationProductType$ = this._loanApplicationProductType.asObservable();

  set loanApplicationSector(value: LoanApplicationSectorType) {
    // // console.log('loan application sector set', value);
    this._loanApplicationSector.next(value);
  }

  set loanApplicationProductType(value: any) {
    this._loanApplicationProductType.next(value);
  }

  get loanApplicationSector(): LoanApplicationSectorType {
    return this._loanApplicationSector.getValue();
  }

  get loanApplicationProductType() {
    return this._loanApplicationProductType.getValue();
  }

  constructor(
    private laHttpService: LoanApplicationHttpService,
    // private storage: SecureStorageService,
    private userDataService: UserDataService,
  ) {
    // this.userDetails = JSON.parse(this.storage.get('user-data'));
    // // console.log('user details in loan application service', this.userDetails);

    this.userDetails = this.userDataService.getUserData();
  }

  initLoanApplication(loanType: string, sector: string, productType: string) {
    this.userDetails = this.userDataService.getUserData();

    const payload = {
      loanApplicationType: loanType,
      productType: productType,
      sectorType: sector,
      userName: this.userDetails.genericServiceBean.newLoginBean.loginId,
      sessionId: this.userDetails.sessionId,
    };

    return this.laHttpService.initLoanApplication(payload);
  }

  initMabogoDinkuLoanApplication(loanType: string, sector: string, productType: string) {
    this.userDetails = this.userDataService.getUserData();

    const payload = {
      loanApplicationType: loanType,
      productType: productType,
      sectorType: sector,
      userName: this.userDetails.genericServiceBean.newLoginBean.loginId,
      sessionId: this.userDetails.sessionId,
    };

    return this.laHttpService.initMabogoDinkuLoanApplication(payload);
  }

  saveIndividualLoanApplication(individualDetails: any) {
    // // console.log('individual details in service', individualDetails);
    return this.laHttpService.saveIndividualLoanApplication(individualDetails) as Observable<any>;
  }

  saveIndividualLoanApplicationMabogoDinku(individualDetails: any) {
    // // console.log('individual details in service', individualDetails);
    return this.laHttpService.saveIndividualLoanApplicationMabogoDinku(
      individualDetails,
    ) as Observable<any>;
  }

  saveApplicationDetails(applicationDetails: any) {
    // // console.log('application details in service', applicationDetails);
    return this.laHttpService.saveApplicationDetails(applicationDetails) as Observable<any>;
  }

  saveApplicationDetailsMabogoDinku(applicationDetails: any) {
    // // console.log('application details in service', applicationDetails);
    return this.laHttpService.saveApplicationDetailsMabogoDinku(
      applicationDetails,
    ) as Observable<any>;
  }

  saveLegalPersona(legalPersonaDetails: any) {
    // // console.log('legal persona details in service', legalPersonaDetails);
    return this.laHttpService.saveLegalPersona(legalPersonaDetails) as Observable<any>;
  }

  saveLegalPersonaMabogoDinku(legalPersonaDetails: any) {
    // // console.log('legal persona details in service', legalPersonaDetails);
    return this.laHttpService.saveLegalPersonaMabogoDinku(legalPersonaDetails) as Observable<any>;
  }

  uploadDocument(payload: any) {
    // // console.log('payload in service', payload);
    return this.laHttpService.uploadDocuments(payload);
  }

  getDocument(id: string) {
    return this.laHttpService.getDocument(id).pipe(
      map((res: any) => {
        return { url: URL.createObjectURL(res) };
      }),
    );
  }

  getLoanApplicationDetails(applicationId: string) {
    this.userDetails = this.userDataService.getUserData();
    const payload = {
      applicationId: applicationId,
      sessionId: this.userDetails.sessionId,
      username: this.userDetails.genericServiceBean.newLoginBean.loginId,
    };
    // // console.log('get loan application details payload', payload);
    return this.laHttpService.getLoanApplicationDetails(payload) as Observable<any>;
    // return of(MabogoDinkuApplicationFakeData).pipe(delay(2000)) as Observable<any>;
  }

  getLoanApplicationDetailsMabogoDinku(applicationId: string) {
    this.userDetails = this.userDataService.getUserData();
    const payload = {
      applicationId: applicationId,
      sessionId: this.userDetails.sessionId,
      username: this.userDetails.genericServiceBean.newLoginBean.loginId,
    };
    // // console.log('get loan application details payload', payload);
    return this.laHttpService.getLoanApplicationDetailsMabogoDinku(payload) as Observable<any>;
    // return of(MabogoDinkuApplicationFakeData).pipe(delay(2000)) as Observable<any>;
  }

  getAllLoanApplication(): Observable<any> {
    this.userDetails = this.userDataService.getUserData();
    const payload = {
      sessionId: this.userDetails.sessionId,
      userName: this.userDetails.genericServiceBean.newLoginBean.loginId,
    };

    console.log('Hitting backend from services');

    return this.laHttpService.getAllLoanApplication(payload);
  }

  submitLoanApplication(applicationId: string) {
    this.userDetails = this.userDataService.getUserData();
    const submitPayload = {
      sessionId: this.userDetails.sessionId,
      applicationId: applicationId,
    };
    return this.laHttpService.submitLoanApplication(submitPayload);
  }
}
