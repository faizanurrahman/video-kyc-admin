import { DestroyRef, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../../../shared/utils/custom-validators';

@Injectable({ providedIn: 'root' })
export class MabogoDinkuGroupDetailsFormService {
  groupDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private destroyRef: DestroyRef) {
    this.initGroupDetailsForm();
  }

  private initGroupDetailsForm() {
    this.groupDetailsForm = this.fb.group(
      {
        id: [''],
        applicationId: [''],
        sessionId: [''],
        nameOfOrganization: [
          '',
          [Validators.required, CustomValidators.firstLetterCapitalizedValidator()],
        ],
        // dateOfIncorporation: ['', [Validators.required]],
        registrationNumber: ['', [Validators.required, Validators.pattern(/^BW\d{11}$/i)]],
        // Note: registration number is changed to UIN number
        preferredCorrespondanceAddr: ['', [Validators.required]],
        postalAddrPoBox: ['', [Validators.required]],
        postalAddrTown: ['', [Validators.required]],
        bussAddrPlot: ['', [Validators.required]],
        bussAddrLocation: ['', []],
        bussAddrDistrict: ['', [Validators.required]],
        bussAddrCountry: ['', [Validators.required]],
        bussAddrTradingAs: ['', []],
        numberOfContacts: ['', []],
        // primaryContactPreferredCommType: ['', [Validators.required]],
        primaryContactMobNumberCode: ['267', [Validators.required]],
        primaryContactMobNumber: ['', [Validators.required, Validators.pattern(/^7\d{3}\d{4}$/)]],

        primaryContactOtherContactNumber: ['', []],
        primaryContactOtherContactNumberCode: ['267', []],
        primaryContactEmailAddress: [
          '',
          [Validators.required, CustomValidators.emailAddressValidator()],
        ],
        fillStatus: [false],
      },
      {
        updateOn: 'change',
      },
    );
  }
}
