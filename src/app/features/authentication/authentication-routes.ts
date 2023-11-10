import { Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },

      {
        path: 'login',
        loadComponent: () =>
          import('./authentication-login/authentication-login.component').then(
            (c) => c.AuthenticationLoginComponent,
          ),
      },

      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./authentication-forgot-password/authentication-forgot-password.component').then(
            (c) => c.AuthenticationForgotPasswordComponent,
          ),
      },

      {
        path: 'forgot-login-id',
        loadComponent: () =>
          import('./authentication-forgot-login-id/authentication-forgot-login-id.component').then(
            (c) => c.AuthenticationForgotLoginIdComponent,
          ),
      },

      {
        path: 'registration',
        loadComponent: () =>
          import('./authentication-registration/authentication-registration.component').then(
            (c) => c.AuthenticationRegistrationComponent,
          ),
      },

      {
        path: 'under-maintainance',
        loadComponent: () =>
          import('./errors/under-maintainance/under-maintainance.component').then(
            (c) => c.UnderMaintainanceComponent,
          ),
      },

      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
