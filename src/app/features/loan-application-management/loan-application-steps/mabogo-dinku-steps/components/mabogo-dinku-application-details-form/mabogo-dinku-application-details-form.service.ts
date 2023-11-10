import { DestroyRef, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class MabogoDinkuApplicationDetailsFormService {
  applicationDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private destroyRef: DestroyRef) {
    this.initializeApplicationDetailsForm();
  }

  private initializeApplicationDetailsForm() {
    this.applicationDetailsForm = this.fb.group(
      {
        id: [''],
        applicationId: [''],
        sessionId: [''],
        data: this.fb.array([this.createApplicationDetailsForIndividual()], { updateOn: 'change' }),
      },
      { updateOn: 'change' },
    );
  }

  private createApplicationDetailsForIndividual() {
    return this.fb.group(
      {
        branchId: ['', { validators: [Validators.required], updateOn: 'change' }],
        applicationAmount: [
          '',
          {
            validators: [Validators.required, Validators.pattern(/[0-9]+/)],
            updateOn: 'blur',
          },
        ],
        product: ['', { validators: [Validators.required], updateOn: 'change' }],
        fillStatus: [false],
      },
      {
        updateOn: 'change',
      },
    );
  }
}
