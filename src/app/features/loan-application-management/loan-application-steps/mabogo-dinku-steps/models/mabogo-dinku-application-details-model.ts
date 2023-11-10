export interface MabogoDinkuApplicationDetailsModel {
  id: number;
  individualId?: any;
  sessionId: string;
  applicationId: string;
  preferredServiceCentre: string;
  branchId: string;

  applicationAmount: string;
  sector: string;

  product: string;

  savings?: any;

  fillStatus?: string;
}

export interface MabogoDinkuApplicationDetailsUpdated {
  id: number;
  sessionId: number;
  applicationId: number;

  individualId?: any;
  preferredServiceCentre: string;
  branchId: string;
  applicationAmount: string;
  sector: string;
  product: string;

  savings?: any;
  fillStatus?: string;
}
