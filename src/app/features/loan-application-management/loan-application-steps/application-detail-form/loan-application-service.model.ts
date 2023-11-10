export interface LoanApplicationServiceDetailsModel {
  id: number;
  sessionId: string;
  applicationId: string;
  preferredServiceCentre: string;
  branchId: string;
  purposeOfLoan: string;
  newOrExistingFacility: string;
  businessStatus: string;
  applicationAmount: string;
  sector: string;
  subSector1: string;
  subSector2: string;
  subSector3: string;
  subSector4: string;
  product: string;
  consituency: string;
  location: string;
  fillStatus?: string;
}

interface Data {
  serviceCentres: LoanApplicationServiceDetailsModel;
}

export interface LoanApplicationServiceDetailsResponseModel {
  status: string;
  statusCode: string;
  statusDesc: string;
  decisionPageRequired: boolean;
  data: Data;
}
