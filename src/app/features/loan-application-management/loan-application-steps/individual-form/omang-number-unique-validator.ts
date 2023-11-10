// import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

// export function omangNumberUniqueValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const individualList = control.get('individualList') as FormArray;

//     if (individualList && individualList.length > 1) {
//       const omangNumbers = individualList.value
//         .filter((individual: any) => !!individual.omangNumber) // Filter out empty, null, or undefined omangNumbers
//         .map((individual: any) => individual.omangNumber);

//       if (hasDuplicates(omangNumbers)) {
//         return { omangNumberNotUnique: true };
//       }
//     }

//     return null;
//   };
// }

// function hasDuplicates(array: any[]): boolean {
//   return new Set(array).size !== array.length;
// }

import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

// Step 1: Define a custom validator function factory called omangNumberUniqueValidator
export function omangNumberUniqueValidator(): ValidatorFn {
  // Step 2: Return a validator function that takes an AbstractControl
  return (control: AbstractControl): ValidationErrors | null => {
    // Step 3: Get the 'individualList' form control from the parent control
    const individualList = control.get('individualList') as FormArray;

    // Step 4: Check if 'individualList' exists and has more than one individual
    if (individualList && individualList.length > 1) {
      // Step 5: Create an array of objects containing omangNumber and index for each individual
      const omangNumbers = individualList.value
        .filter((individual: any) => !!individual.omangNumber) // Filter out empty, null, or undefined omangNumbers
        .map((individual: any, index: number) => ({ omangNumber: individual.omangNumber, index }));

      // Step 6: Find duplicate omangNumbers using the findDuplicates function
      const duplicateOmangNumbers = findDuplicates(omangNumbers);

      // Step 7: If duplicates are found, return an error object with duplicate indices
      if (duplicateOmangNumbers.length > 0) {
        const duplicateIndices = duplicateOmangNumbers.map((item) => item.index);
        return { omangNumberNotUnique: duplicateIndices };
      }
    }

    // Step 8: If no duplicates are found, return null (no validation error)
    return null;
  };
}

// Step 9: Define a helper function findDuplicates to find duplicate omangNumbers
function findDuplicates(array: any[]): any[] {
  // Step 10: Create an object to store counts of each omangNumber
  const counts = array.reduce((acc, item) => {
    if (!acc[item.omangNumber]) {
      acc[item.omangNumber] = 0;
    }
    acc[item.omangNumber]++;
    return acc;
  }, {});

  // Step 11: Filter the array to only include items with counts greater than 1 (duplicates)
  return array.filter((item) => counts[item.omangNumber] > 1);
}
