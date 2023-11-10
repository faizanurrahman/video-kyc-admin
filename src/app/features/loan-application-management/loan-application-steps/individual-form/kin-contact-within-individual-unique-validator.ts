import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator for individual kin contacts
export function kinContactsWithinDifferentValidator(): ValidatorFn {
  return (individualForm: AbstractControl): ValidationErrors | null => {
    const nkContact = individualForm.get('nkContact')?.value;
    const nkContact2 = individualForm.get('nkContact2')?.value;
    if (!!nkContact === false || !!nkContact2 === false) return null;

    if (nkContact === nkContact2) {
      return { kinContactsWithinNotDifferent: true };
    }

    return null;
  };
}
