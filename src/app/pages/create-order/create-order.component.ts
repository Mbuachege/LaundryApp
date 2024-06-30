import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CategoryService } from 'src/app/core/services/categories.service';
import { CustomersService } from 'src/app/core/services/customers.service';
import { OrdersService } from 'src/app/core/services/orders.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  clothesform: UntypedFormGroup;
  servicesform: UntypedFormGroup;
  form1: UntypedFormGroup;
  breadCrumbItems: Array<{}>;
  submit: boolean = false;
  mainformsubmit: boolean = false;
  submitServices: boolean = false;
  indexCounter: number = 0;
  CategoriesSource: any = [];
  SubCategoriesSource: any = [];
  customersdataSource: any = [];
  ServiceCategoriesSource: any = [];
  ServicesSubCategoriesSource: any = [];
  OrderDetailsData: any = [];
  isEditing: boolean;
  CustomerId: any;
  dateFrom: any;
  OrderId: any;
  ClothesPrice: any;
  TotalClothes: number = 0;
  sum: number;
  ClothesTotalAmount: number = 0;
  ServiceTotalAmount: number = 0;
  TotalKgs: number;
  CategoryId: any;
  ServicesCategoryId: any;
  SubCategoryId: any;
  ServicesSubCategoryId: any;
  TotalServices: number = 0;
  ServiceCategoryId: any;
  ServiceSubCategoryName: any;
  ServiceCategoryName: any;
  totalservicesAmount: number = 0;
  CategoryName: any = true;
  hidePriceColumn = false;
  SubCategoryName: any;
  ServicePrice: number;
  loading: boolean;
  currentUser: any;
  gridBoxValue: number[] = [0];
  isGridBoxOpened: boolean;
  OrderDetails: any = [];
  clothes: any = [];
  Services: any = [];
  selectValue: string[] = [];
  stateValue: string[] = [];

  constructor(public formBuilder: UntypedFormBuilder, public orderService: OrdersService, private ref: ChangeDetectorRef, public customersservice: CustomersService, private categoryservice: CategoryService, public authservice: AuthenticationService, public userservices: UserProfileService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Create Order', active: true }];
    this.currentUser = this.authservice.currentUser();
    this.form1 = this.formBuilder.group({
      date: ['', [Validators.required]],
    });
    this.clothesform = this.formBuilder.group({
      Id: 0,
      Category: ['', [Validators.required]],
      SubCategory: [''],
      ClothesCount: ['', [Validators.required]],
      TotalKgs: [],
      priceByKGS: [true],
      Amount: []
    });

    this.servicesform = this.formBuilder.group({
      Id: 0,
      ServiceCategoryName: ['', [Validators.required]],
      ServiceSubCategoryName: [''],
      ServicesCount: ['', [Validators.required]],
      ServicesAmount: ['']
    });
    this.getCategories();
    this.GetAllServiceCategories();
    this.GetCustomers();

    this.stateValue = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Montana', 'Nevada', 'New Mexico', 'New York', 'North Dakota', 'Texas', 'Virginia', 'Wisconsin', 'Wyoming']
  }
  get form() { return this.clothesform.controls; }

  get mainform() { return this.form1.controls; }

  get form2() { return this.servicesform.controls; }

  GetCustomers() {
    this.loading = true;
    this.customersservice.GetAllCustomers().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.customersdataSource = response;
        console.log(this.customersdataSource);
        this.loading = false;
      }
    })
  }

  validSubmit() {
    this.submit = true;
  }
  getCategories() {
    this.loading = true;
    this.categoryservice.GetAllClothesCategories().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.CategoriesSource = response;
        this.loading = false;
      }
    })
  }
  GetAllServiceCategories() {
    this.loading = true;
    this.categoryservice.GetAllServiceCategories().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.ServiceCategoriesSource = response;
        this.loading = false;
      }
    })
  }
  AddClothes() {
    const data = this.clothesform.value;
    this.indexCounter++;
    if (this.clothesform.invalid)
      return;
    const req = {
      Id: this.indexCounter,
      OrderId: 0,
      CategoryId: this.CategoryId,
      SubCategoryId: this.SubCategoryId,
      Category: this.CategoryName,
      SubCategory: this.SubCategoryName,
      Price: (this.ClothesPrice * data.ClothesCount),
      Count: parseInt(data.ClothesCount, 10)
    };
    console.log(req);
    this.clothes.push(req);
    let sum = 0;
    for (let i = 0; i < this.clothes.length; i++) {
      sum += this.clothes[i].Count;
    };
    let clothesTotal = 0;
    for (let i = 0; i < this.clothes.length; i++) {
      clothesTotal += this.clothes[i].Price;
    };
    if (this.hidePriceColumn = true) {
      this.ClothesTotalAmount = clothesTotal;
    };
    this.TotalClothes = sum;
    console.log('Sum of Count:', sum);
    this.CategoryName = "";
    this.SubCategoryName = "";
    this.clothesform.controls.Category.reset();
    this.clothesform.controls.SubCategory.reset();
    this.clothesform.controls.ClothesCount.reset();
  }
  AddService() {
    const data = this.servicesform.value;
    this.indexCounter++;
    if (this.servicesform.invalid)
      return;
    const req = {
      Id: this.indexCounter,
      CategoryId: this.ServiceCategoryId,
      OrderId: 0,
      SubCategoryId: this.ServicesSubCategoryId,
      Category: this.ServiceCategoryName,
      SubCategory: this.ServiceSubCategoryName,
      Price: (this.ServicePrice * data.ServicesCount),
      Count: parseInt(data.ServicesCount, 0)
    };
    console.log(req);
    this.Services.push(req);
    let sum = 0;
    let totalservicesPrice = 0;
    for (let i = 0; i < this.Services.length; i++) {
      sum += this.Services[i].Count;
      totalservicesPrice += this.Services[i].Price;
    }
    this.totalservicesAmount = totalservicesPrice;
    this.TotalServices = sum;

    console.log('Sum of Count:', sum);
    this.ServiceCategoryName = "";
    this.ServiceSubCategoryName = "";
    this.servicesform.controls.ServiceCategoryName.reset();
    this.servicesform.controls.ServiceSubCategoryName.reset();
    this.servicesform.controls.ServicesCount.reset();
  }
  deleteItem(id: number) {
    const index = this.clothes.findIndex(item => item.Id === id);
    if (index !== -1) {
      this.clothes.splice(index, 1);
    }
    let sum = 0;
    for (let i = 0; i < this.clothes.length; i++) {
      sum += this.clothes[i].Count;
    }
    this.TotalClothes = sum;
  }
  deleteService(id: number) {
    const index = this.Services.findIndex(item => item.Id === id);
    if (index !== -1) {
      this.Services.splice(index, 1);
      let sum = 0;
      let totalservicesPrice = 0;
      for (let i = 0; i < this.Services.length; i++) {
        sum += this.Services[i].Count;
        totalservicesPrice += this.Services[i].Price;
      }
      this.totalservicesAmount = totalservicesPrice;
      this.TotalServices = sum;
    }
  }
  getSubcategotyById(CategoryId) {
    this.loading = true;
    this.categoryservice.GetClothesSubCategoriesByCategoryId(CategoryId).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.SubCategoriesSource = response;
        this.loading = false;
      }
    })
  }
  GetServiceSubCategoriesByCategoryId(CategoryId) {
    this.loading = true;
    this.categoryservice.GetServiceSubCategoriesByCategoryId(CategoryId).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.ServicesSubCategoriesSource = response;
        this.loading = false;
      }
    })
  }
  onCheckboxChange(event: any): void {
    if (event.target.checked === true) {
      this.hidePriceColumn = true;
      this.ClothesTotalAmount = 0;
    } else {
      this.hidePriceColumn = false;
      let clothesTotal = 0;
      for (let i = 0; i < this.clothes.length; i++) {
        clothesTotal += this.clothes[i].Price;
        this.ClothesTotalAmount = clothesTotal;
      }
    }
    console.log(event.target.checked);
  }

  onCategoriesChange(event: any) {
    this.CategoryId = event.Id;
    this.CategoryName = event.Name;
    this.getSubcategotyById(event.Id);
    this.clothesform.controls.SubCategory.reset();
    this.clothesform.controls.ClothesCount.reset();
  }
  onSubCategoriesChange(event: any) {
    this.SubCategoryId = event.Id;
    this.SubCategoryName = event.FabricType;
    this.ClothesPrice = event.Price;
    this.clothesform.controls.ClothesCount.reset();
  }
  onKgsChange(event: any) {
    this.TotalKgs = event.target.value;
    this.ClothesTotalAmount = this.TotalKgs * 50;
    console.log(this.ClothesTotalAmount);

  }
  onServiceTotal(event: any) {

  }
  onServiceCategoryChange(event: any) {
    this.ServiceCategoryId = event.Id;
    this.ServiceCategoryName = event.Name;
    this.GetServiceSubCategoriesByCategoryId(event.Id);
    this.servicesform.controls.ServiceSubCategoryName.reset();
    this.servicesform.controls.ServicesCount.reset();
  }
  onServiceSubCategoriesChange(event: any) {
    this.ServicesSubCategoryId = event.Id;
    this.ServiceSubCategoryName = event.Title;
    this.ServicePrice = event.Price;
    this.GetServiceSubCategoriesByCategoryId(event.Id);
    this.servicesform.controls.ServicesCount.reset();
  }
  onServiceChange(event: any) {
    this.TotalKgs = event.target.value;
    this.ServiceTotalAmount = this.TotalKgs * 50;
    console.log(this.ServiceTotalAmount);
    const req = {
      Quantity: this.TotalClothes,
      Amount: this.ServiceTotalAmount
    };
    this.OrderDetails.push(req);
  }
  calculateGrandTotal(column: string): number {
    return this.OrderDetails.reduce((total, item) => total + parseFloat(item[column]), 0.00);
  }
  CalculateTotal() {
    this.OrderDetails = [];
    const details = {
      Type: 'Services',
      Quantity: this.TotalServices,
      Amount: this.totalservicesAmount
    };
    this.OrderDetails.push(details);

    const req = {
      Type: 'Clothes',
      Quantity: this.TotalClothes,
      Amount: this.ClothesTotalAmount
    };
    this.OrderDetails.push(req);
  }
  gridBox_displayExpr(item) {
    return item && `${item.Id} [${item.FullName}] `;
  }
  onGridBoxOptionChanged(e) {
    if (e.name === 'value') {
      this.CustomerId = e.value[0];
      this.isGridBoxOpened = false;
      this.ref.detectChanges();
    }
  }
  onDateChange(NewDate: any): void {
    this.dateFrom = moment(NewDate).format('YYYY-MMM-DD');
    console.log(NewDate);
  }
  successmsg() {
    Swal.fire('Order Created', 'Order Created Successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Added', msg, 'error');
  }
  saveOrder() {
    this.mainformsubmit = true;
    const data = this.form1.value;
    const req = {
      Id: 0,
      CustomerId: this.CustomerId,
      ProcessId: 0,
      Amount: this.calculateGrandTotal('Amount'),
      ClothesTotal: this.ClothesTotalAmount,
      ServicesTotal: this.totalservicesAmount,
      TotalKgs: this.TotalKgs,
      Date: data.date,
      CreatedBy: this.currentUser.Username
    };
    console.log(req);
    this.InsertOrder(req);

  }
  InsertOrder(req) {
    this.loading = true;
    this.orderService.InsertOrder(req).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.OrderId = response.Data.Id;
        console.log(response);
        console.log(this.clothes);
        console.log(this.Services);
        this.clothes.forEach((paymentItem: any) => {
          paymentItem.OrderId = this.OrderId;
        });
        if (this.clothes.length > 0) {
          this.clothes.forEach(item => {
            const req = {
              Id: 0,
              OrderId: this.OrderId,
              CategoryId: item.CategoryId,
              SubCategoryId: item.SubCategoryId,
              Quantity: item.Count,
              Price: item.Price,
              ByKgs: this.hidePriceColumn,
              Category: 'Clothes',
              CreatedBy: this.currentUser.Username
            };
            console.log(req);
            this.OrderDetailsData.push(req);
          });
        }
        if (this.Services.length > 0) {
          this.Services.forEach(item => {
            const req = {
              Id: 0,
              OrderId: this.OrderId,
              CategoryId: item.CategoryId,
              SubCategoryId: item.SubCategoryId,
              Quantity: item.Count,
              Price: item.Price,
              Category: 'Services',
              CreatedBy: this.currentUser.Username
            };
            this.OrderDetailsData.push(req);
          });
        }
        this.InsertOrderDetails(this.OrderDetailsData);
        this.loading = false;
        this.successmsg();
        this.servicesform.controls.ServiceCategoryName.reset();
        this.servicesform.controls.ServiceSubCategoryName.reset();
        this.servicesform.controls.ServicesCount.reset();
        this.clothesform.controls.Category.reset();
        this.clothesform.controls.SubCategory.reset();
        this.clothesform.controls.ClothesCount.reset();
        this.Services = [];
        this.clothes = [];
        this.OrderDetailsData = [];
        this.OrderDetails = [];
        this.ClothesTotalAmount = 0;
        this.TotalKgs = 0;
        this.TotalServices = 0;
        this.totalservicesAmount = 0;
        this.TotalClothes = 0;

      }
    })
  }
  InsertOrderDetails(req) {
    this.loading = true;
    this.orderService.InsertOrderDetails(req).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
      }
    })
  }

}
