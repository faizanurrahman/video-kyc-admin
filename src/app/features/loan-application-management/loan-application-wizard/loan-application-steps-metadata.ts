import { WizardStep } from '../components/horizontal-wizard/wizard-steps/wizard-steps.component';
import { LoanApplicationType } from '../models/loan-application.enum';

export function getLoanApplicationStepMetadata(loanType: LoanApplicationType) {
  let steps: WizardStep[] = [];
  if (loanType === 'individual' || loanType === 'Individual') {
    steps = [
      {
        stepTitle: 'Personal Details',
        stepNumber: 1,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Application Details',
        stepNumber: 2,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Upload Documents',
        stepNumber: 3,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Review & Submit',
        stepNumber: 4,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
    ];
  }

  if (loanType === 'company' || loanType === 'Company') {
    steps = [
      {
        stepTitle: 'Company Details',
        stepNumber: 1,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Individual Details',
        stepNumber: 2,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Application Details',
        stepNumber: 3,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Upload Documents',
        stepNumber: 4,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Review & Submit',
        stepNumber: 5,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
    ];
  }

  if (loanType === 'group' || loanType === 'Group' || loanType === 'GROUP') {
    steps = [
      {
        stepTitle: 'Group Details',
        stepNumber: 1,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Individual Details',
        stepNumber: 2,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Application Details',
        stepNumber: 3,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Upload Documents',
        stepNumber: 4,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Review & Submit',
        stepNumber: 5,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
    ];
  }

  if (loanType === 'mabogoDinku' || loanType === 'Mabogo Dinku') {
    steps = [
      {
        stepTitle: 'Mabogo Dinku Details',
        stepNumber: 1,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Individual Details',
        stepNumber: 2,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Application Details',
        stepNumber: 3,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Upload Documents',
        stepNumber: 4,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
      {
        stepTitle: 'Review & Submit',
        stepNumber: 5,
        stepDescription: 'Individual Details',
        stepState: 'pending',
        stepStatus: 'invalid',
        progress: 0,
      },
    ];
  }

  return steps;
}
