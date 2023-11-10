import { Routes } from '@angular/router';
import { AuthenticationComponent } from '../../features/authentication/authentication.component';
import { LoginV2Component } from './components/login-v2/login-v2.component';
import { LoginV3Component } from './components/login-v3/login-v3.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    // component: AuthComponent,
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        // component: LoginV2Component,
        loadComponent: () =>
          import(
            './../../features/authentication/authentication-login/authentication-login.component'
          ).then((c) => c.AuthenticationLoginComponent),
        // loadComponent: () => import('./components/login/login.module').then(m => m.LoginModule),
        data: { returnUrl: window.location.pathname },
      },

      {
        path: 'under-maintainance',
        loadComponent: () =>
          import(
            './../../features/authentication/errors/under-maintainance/under-maintainance.component'
          ).then((c) => c.UnderMaintainanceComponent),
      },

      {
        path: 'login-v2',
        component: LoginV2Component,
      },
      {
        path: 'login-v3',
        component: LoginV3Component,
      },

      {
        path: 'registration',
        // loadComponent: () =>
        //   import('./components/registration/registration.component').then(
        //     c => c.RegistrationComponent,
        // ),
        loadComponent: () =>
          import(
            './../../features/authentication/authentication-registration/authentication-registration.component'
          ).then((c) => c.AuthenticationRegistrationComponent),
      },
      {
        path: 'forgot-login-id',
        // loadComponent: () =>
        //   import('./components/forgot-login-id/forgot-login-id.component').then(
        //     c => c.ForgotLoginIdComponent,
        //   ),

        loadComponent: () =>
          import(
            './../../features/authentication/authentication-forgot-login-id/authentication-forgot-login-id.component'
          ).then((c) => c.AuthenticationForgotLoginIdComponent),
      },
      {
        path: 'forgot-password',
        // loadComponent: () => {
        //   return import(
        //     './components/forgot-password/forgot-password.module'
        //   ).then((m) => m.ForgotPasswordModule);
        // },
        // component: ForgotPasswordV2Component,
        //  component: AuthenticationForgotPasswordComponent,
        loadComponent: () =>
          import(
            './../../features/authentication/authentication-forgot-password/authentication-forgot-password.component'
          ).then((c) => c.AuthenticationForgotPasswordComponent),
      },
      // {
      //   path: 'logout',
      //   loadComponent: () => {
      //     return import('./components/logout/logout.module').then(m => m.LogoutModule);
      //   },
      // },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class AuthRoutingModule {}
