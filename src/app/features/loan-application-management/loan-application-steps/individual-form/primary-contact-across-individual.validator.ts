import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator function factory for primary mobile number uniqueness
export function primaryMobileNumberUniqueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null;
  };
}

// Helper function to find duplicates
function findDuplicates(array: any[]): any[] {
  const counts = array.reduce((acc, item) => {
    const key = `${item.mobileNumber}-${item.mobileNumberCountryCode}`;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key]++;
    return acc;
  }, {});

  return array.filter((item) => counts[`${item.mobileNumber}-${item.mobileNumberCountryCode}`] > 1);
}
