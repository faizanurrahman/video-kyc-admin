import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/services/auth.guard';

const PagesRouting: Routes = [
  // {
  //   path: 'test',
  //   loadChildren: () => import('./test/test.module').then((m) => m.TestModule),
  // },
  {
    path: 'loan-application-create',
    redirectTo: 'dashboard',
    pathMatch: 'prefix',
  },
  {
    path: 'loan-application-view',
    redirectTo: 'dashboard',
    pathMatch: 'prefix',
  },
  {
    path: 'dashboard',
    // loadChildren: () =>
    //   import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.component').then((m) => m.BuilderComponent),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule,
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },

  {
    path: 'wizard',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },

  {
    path: 'loan-application-management',
    canActivate: [AuthGuard],
    // loadChildren: () =>
    //   import('../features/loan-application-management/loan-application-management.module').then(
    //     (m) => m.LoanApplicationManagementModule,
    //   ),

    loadChildren: () =>
      import('../features/loan-application-management/loan-application-management.routes').then(
        (routes) => routes.loanApplicationManagementRoutes,
      ),
  },

  {
    path: 'feature/loan-calculator',
    canActivate: [AuthGuard],
    // loadChildren: () =>
    //   import('../features/loan-calculator/loan-calculator.module').then(
    //     (m) => m.LoanCalculatorModule,
    //   ),

    loadComponent: () =>
      import('../features/loan-calculator/loan-calculator.component').then(
        (m) => m.LoanCalculatorComponent,
      ),
  },

  {
    path: 'feature/loan-statements',
    canActivate: [AuthGuard],
    // loadChildren: () =>
    //   import('../features/loan-statements/loan-statements.module').then(
    //     (m) => m.LoanStatementsModule,
    //   ),

    loadComponent: () =>
      import('../features/loan-statements/loan-statements.component').then(
        (m) => m.LoanStatementsComponent,
      ),
  },

  {
    path: 'feature/payment-history',
    loadComponent: () =>
      import('../features/payment-history/payment-history.component').then(
        (c) => c.PaymentHistoryComponent,
      ),
  },

  {
    path: 'feature/feedback',
    canActivate: [AuthGuard],
    // loadChildren: () =>
    //   import('../features/app-feedback/app-feedback.module').then((m) => m.AppFeedbackModule),
    loadComponent: () =>
      import('../features/app-feedback/app-feedback.component').then((m) => m.AppFeedbackComponent),
  },

  {
    path: 'feature/loan-payment',
    loadChildren: () =>
      import('../features/loan-payment/loan-payment.module').then((m) => m.LoanPaymentModule),
  },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { PagesRouting };
