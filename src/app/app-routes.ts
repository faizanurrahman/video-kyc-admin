import { Routes } from '@angular/router';
import { NavigateToDashboardGuard } from '@core/guards/navigate-to-dashboard.guard';
import { AuthGuard } from '@modules/auth/services/auth.guard';
import { LoanSelectionNewComponent } from './features/loan-application-management/loan-application-selection/loan-selection-new/loan-selection-new.component';

export const appRoutes: Routes = [
  {
    path: 'auth',
    canActivateChild: [NavigateToDashboardGuard],
    loadChildren: () => import('./modules/auth/auth-routing.module').then((m) => m.AuthRoutes),
  },
  {
    path: 'init-new',
    component: LoanSelectionNewComponent,
  },

  {
    path: 'authentication',
    canActivateChild: [NavigateToDashboardGuard],
    loadChildren: () =>
      import('./features/authentication/authentication-routes').then((m) => m.AuthenticationRoutes),
  },
  {
    path: 'error',
    loadChildren: () => import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    // loadChildren: () => import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
    loadChildren: () => import('./_metronic/layout/layout-routes').then((m) => m.layoutRotes),
  },
  {
    path: ' ',
    canActivate: [AuthGuard],
    redirectTo: '',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'error/404' },
];
