import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationStatusType,
  LoanApplicationType,
} from '../../../models/loan-application.enum';
import { LoanBasicDetails } from '../../../models/loan-basic-details.interface';
import { MabogoDinkuApplicationDetailsModel } from './mabogo-dinku-application-details-model';
import { MabogoDinkuDocsModel } from './mabogo-dinku-document-details-model';
import { MabogoDinkuGroupDetailsModel } from './mabogo-dinku-group-details-model';
import { MabogoDinkuIndividualDetailsModel } from './mabogo-dinku-individual-details-model';

export interface MabogoDinkuApplicationModel {
  id: number;
  applicationId: string;
  loanApplicationType: LoanApplicationType;
  applicationStatus: LoanApplicationStatusType;
  status: string;
  sectorType?: LoanApplicationSectorType;
  productType?: LoanApplicationProductType;
  comments?: string;
  sapStatus?: string;
  sapApplicationId?: string;
  createdOn: Date;
  updatedOn: Date;
  sapAppStatus?: string;

  data: {
    appDetails: MabogoDinkuApplicationDataModel;
  };
}

export interface MabogoDinkuApplicationDataModel {
  loanBasicDetails?: LoanBasicDetails;
  loanIndividualDetails?: MabogoDinkuIndividualDetailsModel[];
  loanLegalPersona?: MabogoDinkuGroupDetailsModel;
  loanServiceCentre?: MabogoDinkuApplicationDetailsModel[];
  loanDocs?: MabogoDinkuDocsModel;
}
