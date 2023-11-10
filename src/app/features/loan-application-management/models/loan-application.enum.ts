export enum LoanApplicationTypeEnum {
  Individual = 'Individual',
  LegalPersona = 'Company',
  Group = 'GROUP',
  MabogoDinku = 'Mabogo Dinku',

  individual = 'individual',
  company = 'company',
  group = 'group',
  mabogoDinku = 'mabogoDinku',
}

export type LoanApplicationType =
  | 'individual'
  | 'Individual'
  | 'company'
  | 'Company'
  | 'group'
  | 'Group'
  | 'GROUP'
  | 'mabogoDinku'
  | 'mabogodinku'
  | 'Mabogo Dinku';

export type LoanApplicationSectorType =
  | 'agriBusiness'
  | 'agribusiness'
  | 'AgriBusiness'
  | 'manufacturing'
  | 'Manufacturing'
  | 'property'
  | 'Property'
  | 'services'
  | 'Services'
  | null;

export type LoanApplicationStatusType =
  | 'PENDING'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'APPLICATION_NOT_ACCEPTED'
  | 'REQUEST_FOR_CHANGE'
  | 'RESUBMITTED';

export type LoanApplicationProductType =
  | 'mabogoDinku'
  | 'mabogodinku'
  | 'letlhabile'
  | 'tradeFinance'
  | 'tradefinance'
  | 'cedaMainline'
  | 'cedamainline'
  | 'cooperative';
