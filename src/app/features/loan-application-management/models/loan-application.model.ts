import { LoanApplicationServiceDetailsModel } from '../loan-application-steps/application-detail-form/loan-application-service.model';
import { LoanApplicationCompanyOrGroupModel } from '../loan-application-steps/company-or-group-details/loan-application-company-or-group.interface';
import { NewLoanDocsModel } from '../loan-application-steps/document-details-form-updated/document-model';
import { IndividualDetailsModel } from '../loan-application-steps/individual-form/individual-form.model';
import {
  LoanApplicationProductType,
  LoanApplicationSectorType,
  LoanApplicationStatusType,
  LoanApplicationType,
} from './loan-application.enum';
import { LoanBasicDetails } from './loan-basic-details.interface';

export interface LoanApplicationDataModel {
  loanBasicDetails: LoanBasicDetails;
  loanIndividualDetails: IndividualDetailsModel[];
  loanLegalPersona: LoanApplicationCompanyOrGroupModel;
  loanServiceCentre: LoanApplicationServiceDetailsModel;
  loanDocs: NewLoanDocsModel;
}

export interface LoanApplicationModel {
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
    appDetails: LoanApplicationDataModel;
  };
}
