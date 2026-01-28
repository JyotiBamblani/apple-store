import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { ManageUsersComponent } from './dashboard/manage-users/manage-users.component';
import { BillingComponent } from './dashboard/billing/billing.component';

/** App routes: home (storefront), dashboard with children (home, users, billing) */
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      // Default dashboard view: trending products only
      { path: '', component: DashboardHomeComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'billing', component: BillingComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
