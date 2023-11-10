import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MabogoDinkuApplicationDetailsFormService } from '../components/mabogo-dinku-application-details-form/mabogo-dinku-application-details-form.service';
import { MabogoDinkuDocumentDetailsFormService } from '../components/mabogo-dinku-document-details-form/mabogo-dinku-document-details-form.service';
import { MabogoDinkuGroupDetailsFormService } from '../components/mabogo-dinku-group-details-form/mabogo-dinku-group-details-form.service';
import { MabogoDinkuIndividualFormService } from '../components/mabogo-dinku-individual-form/mabogo-dinku-individual-form.service';

@Injectable({
  providedIn: 'root',
})
export class MabogoDinkuApplicationFormService {
  public mabogoDinkuApplicationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private individualFormService: MabogoDinkuIndividualFormService,
    private applicationDetailsFormService: MabogoDinkuApplicationDetailsFormService,
    private documentDetailsFormService: MabogoDinkuDocumentDetailsFormService,
    private groupDetailsFormService: MabogoDinkuGroupDetailsFormService,
  ) {
    this.createMabogoDinkuApplicationForm();
  }

  private createMabogoDinkuApplicationForm() {
    this.mabogoDinkuApplicationForm = this.fb.group({
      loanIndividualDetails: this.individualFormService.individualForm,
      loanLegalPersona: this.groupDetailsFormService.groupDetailsForm,
      loanServiceCentre: this.applicationDetailsFormService.applicationDetailsForm,
      loanDocs: this.documentDetailsFormService.documentDetailsForm,
    });
  }
}
