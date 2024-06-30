import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { AddusersComponent } from './addusers/addusers.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { UserRoleDetailsComponent } from './user-role-details/user-role-details.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { EmployeesComponent } from './employees/employees.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportsComponent } from './reports/reports.component';
import { CategoriesComponent } from './categories/categories.component';
import { CustomersComponent } from './customers/customers.component';
import { ExpendituresComponent } from './expenditures/expenditures.component';
import { LaundryStatusComponent } from './laundry-status/laundry-status.component';
import { ServicesCategoryComponent } from './services-category/services-category.component';
import { ExpenditureCategoriesComponent } from './expenditure-categories/expenditure-categories.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: '/', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'employees', component: EmployeesComponent },
  { path: 'createorder', component: CreateOrderComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'clothescategories', component: CategoriesComponent },
  { path: 'expenditurecategories', component: ExpenditureCategoriesComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'expenditures', component: ExpendituresComponent },
  { path: 'status', component: LaundryStatusComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'users', component: AddusersComponent },
  { path: 'usergroups', component: UserGroupsComponent },
  { path: 'userroledetails', component: UserRoleDetailsComponent },
  { path: 'userroles', component: UserRolesComponent },
  { path: 'servicescategories', component: ServicesCategoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
