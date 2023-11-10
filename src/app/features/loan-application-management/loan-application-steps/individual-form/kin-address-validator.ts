import { AbstractControl, ValidatorFn } from '@angular/forms';

export function differentKinAddressesValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const nkName = control.get('nkName')?.value;
    const nkContact = control.get('nkContact')?.value;
    const nkSurname = control.get('nkSurname')?.value;
    const nkRelationship = control.get('nkRelationship')?.value;
    const nkAddrPlot = control.get('nkAddrPlot')?.value;
    const nkAddrSuburb = control.get('nkAddrSuburb')?.value;
    const nkAddrTown = control.get('nkAddrTown')?.value;
    const nkAddrCountry = control.get('nkAddrCountry')?.value;
    const nkAddrOne = {
      name: nkName,
      surname: nkSurname,
      relationship: nkRelationship,
      contact: nkContact,
      addrPlot: nkAddrPlot,
      subUrb: nkAddrSuburb,
      town: nkAddrTown,
      country: nkAddrCountry,
    };

    const nkName2 = control.get('nkName2')?.value;
    const nkContact2 = control.get('nkContact2')?.value;
    const nkSurname2 = control.get('nkSurname2')?.value;
    const nkRelationship2 = control.get('nkRelationship2')?.value;
    const nkAddrPlot2 = control.get('nkAddrPlot2')?.value;
    const nkAddrSuburb2 = control.get('nkAddrSuburb2')?.value;
    const nkAddrTown2 = control.get('nkAddrTown2')?.value;
    const nkAddrCountry2 = control.get('nkAddrCountry2')?.value;
    const nkAddrTwo = {
      name: nkName2,
      surname: nkSurname2,
      relationship: nkRelationship2,
      contact: nkContact2,
      addrPlot: nkAddrPlot2,
      subUrb: nkAddrSuburb2,
      town: nkAddrTown2,
      country: nkAddrCountry2,
    };

    if (compareAddressObjects(nkAddrOne, nkAddrTwo)) {
      return { addressesMustBeDifferent: true };
    }

    return null;
  };
}

function compareAddressObjects(address1: any, address2: any): boolean {
  // Compare individual properties of the two address objects
  const propertiesToCompare = [
    'name',
    'surname',
    'relationship',
    'contact',
    'addrPlot',
    'subUrb',
    'town',
    'country',
  ];

  for (const property of propertiesToCompare) {
    if (address1[property] !== address2[property]) {
      return false;
    }
  }

  return true;
}
