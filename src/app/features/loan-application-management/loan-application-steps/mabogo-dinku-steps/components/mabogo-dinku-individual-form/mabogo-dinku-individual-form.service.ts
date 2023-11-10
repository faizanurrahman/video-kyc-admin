import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SecureStorageService } from '../../../../../../core/services/secure-storage.service';
import { IbUserModel } from '../../../../../../modules/auth/models/ib-user.model';
import { differentKinAddressesValidator } from '../../../individual-form/kin-address-validator';
import { kinContactsWithinDifferentValidator } from '../../../individual-form/kin-contact-within-individual-unique-validator';
import { omangNumberUniqueValidator } from '../../../individual-form/omang-number-unique-validator';
import { primaryMobileNumberUniqueValidator } from '../../../individual-form/primary-contact-across-individual.validator';

@Injectable({
  providedIn: 'root',
})
export class MabogoDinkuIndividualFormService {
  public individualForm: FormGroup;

  public individualDetailsList: FormArray;

  constructor(
    private fb: FormBuilder,
    private storage: SecureStorageService,
    private destroyRef: DestroyRef,
  ) {
    this.initializeMabogoDinkuIndividualForm();
  }

  public initializeMabogoDinkuIndividualForm() {
    // get user data from storage
    const userData = this.storage.get('user-data');

    // parse user details from JSON and cast to IbUserModel interface
    const userDetails = JSON.parse(userData) as IbUserModel;

    this.individualForm = this.fb.group(
      {
        applicationId: [''],
        sessionId: [''],
        username: [''],
        individualList: this.fb.array([this.createIndividual()], { updateOn: 'change' }),
      },
      {
        updateOn: 'change',
        validators: [omangNumberUniqueValidator(), primaryMobileNumberUniqueValidator()],
      },
    );
  }

  public createIndividual(): FormGroup {
    let individualForm = this.fb.group(
      {
        id: [''],
        title: ['', [Validators.required]],
        fullName: ['', [Validators.required]],
        dob: ['', []],
        dateOfBirth: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        maritalStatus: ['', [Validators.required]],
        maritalRegime: [''],
        botswanaCitizen: ['', []],
        omangNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
            Validators.pattern(/^\d{4}[12]\d{4}$/),
          ],
        ],
        dateOfOmangExpiry: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        foreignPassportNumber: ['', []],

        foreignPassportExpiry: ['', []],
        nationality: ['', [Validators.required]],
        communicationType: ['', []],
        mobileNumber: ['', [Validators.required]],
        mobileNumberCountryCode: ['267'],
        mobileNumberStatus: new FormControl<'NOT_VERIFIED' | 'VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
          Validators.pattern('VERIFIED'),
        ]),

        secondaryMobileNumber: ['', []],
        secondaryMobileNumberCountryCode: ['267'],
        otherContactNumber: ['', []],
        otherContactNumberCountryCode: ['267'],
        emailAddress: ['', []],
        emailAddressStatus: new FormControl<'NOT_VERIFIED' | 'VERIFIED'>('NOT_VERIFIED', [
          Validators.required,
        ]),
        corresspondanceAddress: ['', []],
        addrPlot: ['', [Validators.required]],
        addrSuburb: ['', [Validators.required]],
        addrTown: ['', [Validators.required]],
        addrCountry: ['', [Validators.required]],
        addrDuration: ['', []],
        postalAddrPoBox: ['', [Validators.required]],
        postalAddrTown: ['', [Validators.required]],

        hvAddrPlot: ['', [Validators.required]],
        hvAddrSuburb: ['', [Validators.required]],
        hvAddrTown: ['', [Validators.required]],
        hvAddrCountry: ['', [Validators.required]],
        nkAddrPlot: ['', [Validators.required]],
        nkAddrSuburb: ['', [Validators.required]],
        nkAddrTown: ['', [Validators.required]],
        nkAddrCountry: ['', [Validators.required]],
        nkContact: ['', [Validators.required]],
        nkContactCountryCode: ['267'],
        nkName: ['', [Validators.required]],
        nkSurname: ['', [Validators.required]],
        nkRelationship: ['', [Validators.required]],

        nkAddrPlot2: ['', [Validators.required]],
        nkAddrSuburb2: ['', [Validators.required]],
        nkAddrTown2: ['', [Validators.required]],
        nkAddrCountry2: ['', [Validators.required]],
        nkContact2: ['', [Validators.required]],
        nkContact2CountryCode: ['267'],
        nkName2: ['', [Validators.required]],
        nkSurname2: ['', [Validators.required]],
        nkRelationship2: ['', [Validators.required]],

        bussAddrPlot: ['', []], // removed required
        bussAddrSuburb: ['', []], // removed required
        bussAddrTown: ['', []],
        bussAddrCountry: ['', []], // removed required
        bussAddrTradingAs: ['', []],
        disability: ['', [Validators.required]],
        disabilityType: ['', []],
        disabilityDocuments: [[], []],
        creditCheck: ['', [Validators.required]],
        fillStatus: [false],
      },
      {
        updateOn: 'change',
        validators: [differentKinAddressesValidator(), kinContactsWithinDifferentValidator()],
      },
    );

    // if loan application type is company
    // if (this.loanApplicationType.toLowerCase() === 'company') {
    //   individualForm.get('creditCheck')?.setValidators(Validators.required);
    // } else if (this.loanApplicationType.toLowerCase() === 'group') {
    //   individualForm.get('creditCheck')?.setValidators(Validators.required);
    // } else if (
    //   this.loanApplicationType.toLowerCase() === 'mabogodinku' ||
    //   this.loanApplicationType.toLowerCase() === 'mabogo dinku'
    // ) {
    //   individualForm.get('creditCheck')?.setValidators(Validators.required);
    // } else if (this.loanApplicationType.toLowerCase() === 'individual') {
    //   individualForm.get('creditCheck')?.setValidators(Validators.required);
    // }
    individualForm.updateValueAndValidity();

    individualForm
      .get('nationality')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        if (value === 'BW') {
          // console.log('Country is botswana');
          individualForm.get('gender')?.disable();
          individualForm.get('gender')?.clearValidators();
          individualForm
            .get('omangNumber')
            ?.addValidators([
              Validators.required,
              Validators.minLength(9),
              Validators.maxLength(9),
              Validators.pattern(/^\d{4}[12]\d{4}$/),
            ]);

          individualForm.get('dateOfOmangExpiry')?.addValidators([Validators.required]);

          individualForm.get('foreignPassportNumber')?.setValue('');
          individualForm.get('foreignPassportExpiry')?.setValue('');
          individualForm.get('foreignPassportNumber')?.clearValidators();
          individualForm.get('foreignPassportExpiry')?.clearValidators();
          individualForm.get('foreignPassportNumber')?.updateValueAndValidity();
          individualForm.get('foreignPassportExpiry')?.updateValueAndValidity();
        } else {
          // console.log('Country is not botswana');
          individualForm.get('gender')?.enable();
          individualForm.get('gender')?.addValidators([Validators.required]);
          individualForm.get('omangNumber')?.clearValidators();
          individualForm.get('dateOfOmangExpiry')?.clearValidators();

          individualForm.get('omangNumber')?.setValue('');
          individualForm.get('dateOfOmangExpiry')?.setValue('');

          individualForm.get('omangNumber')?.updateValueAndValidity();
          individualForm.get('dateOfOmangExpiry')?.updateValueAndValidity();

          individualForm.get('foreignPassportNumber')?.setValidators([Validators.required]);
          individualForm.get('foreignPassportExpiry')?.setValidators([Validators.required]);
          individualForm.get('foreignPassportNumber')?.updateValueAndValidity();
          individualForm.get('foreignPassportExpiry')?.updateValueAndValidity();
        }

        individualForm.updateValueAndValidity();
        // this.cdr.markForCheck();
      });

    individualForm.updateValueAndValidity();

    // Dyanmic Disability Options
    individualForm
      .get('disability')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        if (value === true || value === 'true') {
          individualForm.get('disabilityType')?.setValidators(Validators.required);
        } else {
          individualForm.get('disabilityType')?.clearValidators();
          individualForm.get('disabilityType')?.setValue(null);
        }

        individualForm.get('disabilityType')?.updateValueAndValidity();
      });

    // if credit check is without clearance certificate
    // individualForm
    //   .get('creditCheck')
    //   ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value: any) => {
    //     if (value === 'adverseWithoutClearanceCertificate') {
    //       this.nextDisableForCreditCheck = true;
    //     } else {
    //       this.nextDisableForCreditCheck = false;
    //     }
    //   });
    return individualForm;
  }

  public patchIndividualDetails(individualDetails: any) {}
}
