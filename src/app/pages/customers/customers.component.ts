import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CustomersService } from 'src/app/core/services/customers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;

  validationform: UntypedFormGroup;
  breadCrumbItems: Array<{}>;
  submit: boolean = false;
  isEditing: boolean;
  loading: boolean;
  currentUser: any;
  dataSource: any = [];
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  constructor(public formBuilder: UntypedFormBuilder, public authservice: AuthenticationService, public customersservice: CustomersService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Customers', active: true }];
    this.currentUser = this.authservice.currentUser();
    this.validationform = this.formBuilder.group({
      Id: 0,
      FullName: ['', [Validators.required]],
      Location: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      Email: ['', [Validators.required,Validators.email]]
    });
    this.GetCustomers();
  }
  get form() { return this.validationform.controls; }
  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  successmsg() {
    Swal.fire('Customer Added', 'Customer Added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Added', msg, 'error');
  }
  validSubmit() {
    this.submit = true;
    if (this.validationform.invalid)
      return;

    this.loading = true;
    try {
      const data = this.validationform.value;
      const req = {
        Id: data.Id,
        FullName: data.FullName,
        MobileNo: data.PhoneNumber,
        Email: data.Email,
        Location: data.Location,
        CreatedBy: this.currentUser.Username
      };
      this.customersservice.InsertOrUpdateCustomers(req).subscribe({
        next: (data) => {
          const response = JSON.parse(JSON.stringify(data));
          this.successmsg();
          this.GetCustomers();
          this.loading = false;
          this.submit = false;
          this.validationform.reset();
          this.validationform.patchValue({ Id: 0 });
        }
      })
    }
    catch (e) {
      this.errormsg(e.message);
    }
  }
  GetCustomers() {
    this.loading = true;
    this.customersservice.GetAllCustomers().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        console.log(this.dataSource);
        this.loading = false;
      }
    })
  }
  editcustomer(data) {
    this.loading = true;
    this.customersservice.GetCustomersById(data.Id).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        const req = {
          Id: response.Id,
          FullName: response.FullName,
          PhoneNumber: response.MobileNo,
          Email: response.Email,
          Location: response.Location
        };
        this.validationform.patchValue(req);
        this.centerModal(this.template);
        this.loading = false;
      }
    })
  }
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to Delete this Customer? ' + data.FullName,
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        try {
          this.customersservice.DeleteCustomersById(data.Id)
            .subscribe({
              next: (data) => {
                const response: any = JSON.parse(JSON.stringify(data));
                this.GetCustomers();
                this.loading = false;
              }
            });

        } catch (e) {
          this.errormsg(e.message);
          this.loading = false;

        }
        Swal.fire('Deleted', 'Customer Deleted sucessfully.', 'success');
      }
    });
  }
  hideModal() {
    this.modalRef.hide();
    this.submit = false;
    this.validationform.reset();
    this.validationform.patchValue({ Id: 0 });
  }
}
