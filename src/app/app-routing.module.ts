import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ManageUsersComponent } from './dashboard/manage-users/manage-users.component';
import { BillingComponent } from './dashboard/billing/billing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard/users', component: ManageUsersComponent },
  { path: 'dashboard/billing', component: BillingComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }
