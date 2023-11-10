import { Routes } from '@angular/router';
import { AuthGuard } from '../../modules/auth/services/auth.guard';
import { LayoutComponent } from './layout.component';

export const layoutRotes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('../../pages/page-routing').then((m) => m.PagesRouting),
  },
];
