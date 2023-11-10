import { Routes } from '@angular/router';
import { ApplicationDetailFormComponent } from './loan-application-steps/application-detail-form/application-detail-form.component';

import { LegalPersonaFormV2Component } from './loan-application-steps/company-or-group-details/legal-persona-form-v2.component';
import { IndividualFormComponent } from './loan-application-steps/individual-form/individual-form.component';

import { LoanApplicationSelectionComponent } from './loan-application-selection/loan-application-selection.component';
import { MabogoDinkuApplicationWizardComponent } from './loan-application-steps/mabogo-dinku-steps/mabogo-dinku-application-wizard/mabogo-dinku-application-wizard.component';
import { LoanApplicationWizardComponent } from './loan-application-wizard/loan-application-wizard.component';

export const loanApplicationManagementRoutes: Routes = [
  {
    path: '',
    component: LoanApplicationSelectionComponent,
  },
  {
    path: 'init',
    // component: LoanApplicationManagementComponent,
    component: LoanApplicationWizardComponent,
  },
  {
    path: 'mabogo-dinku-init',
    component: MabogoDinkuApplicationWizardComponent,
  },

  {
    path: 'individual',
    component: IndividualFormComponent,
  },

  {
    path: 'legal-persona-v2',
    component: LegalPersonaFormV2Component,
  },
  {
    path: 'application-detail',
    component: ApplicationDetailFormComponent,
  },
];
