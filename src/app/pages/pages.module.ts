import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { HttpClientModule } from '@angular/common/http';
import { ModulesComponent } from './modules/modules.component';

import { DxDataGridModule, DxDropDownBoxModule} from 'devextreme-angular';
import { NgxLoadingModule } from "ngx-loading";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { UserRoleDetailsComponent } from './user-role-details/user-role-details.component';
import { AddusersComponent } from './addusers/addusers.component';
import { UsergrouprolesComponent } from './usergrouproles/usergrouproles.component';
import { EmployeesComponent } from './employees/employees.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportsComponent } from './reports/reports.component';
import { CustomersComponent } from './customers/customers.component';
import { ExpendituresComponent } from './expenditures/expenditures.component';
import { CategoriesComponent } from './categories/categories.component';
import { LaundryStatusComponent } from './laundry-status/laundry-status.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ServicesCategoryComponent } from './services-category/services-category.component';
import { ServicesSubCategoryComponent } from './services-sub-category/services-sub-category.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ExpenditureCategoriesComponent } from './expenditure-categories/expenditure-categories.component';

@NgModule({
  declarations: [
    ModulesComponent,
    UserRolesComponent,
    UserGroupsComponent,
    UserRoleDetailsComponent,
    AddusersComponent,
    UsergrouprolesComponent,
    EmployeesComponent,
    CreateOrderComponent,
    OrdersComponent,
    OrderDetailsComponent,
    ReportsComponent,
    CustomersComponent,
    ExpendituresComponent,
    CategoriesComponent,
    LaundryStatusComponent,
    SubcategoriesComponent,
    ServicesCategoryComponent,
    ServicesSubCategoryComponent,
    ExpenditureCategoriesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    HttpClientModule,
    NgxDropzoneModule,
    NgSelectModule,
    UIModule,
    WidgetModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    DxDropDownBoxModule,
    PickerModule,
    DxDataGridModule,
    BsDatepickerModule.forRoot(),
    NgxLoadingModule.forRoot({

    })
    
  ],
})
export class PagesModule { }




