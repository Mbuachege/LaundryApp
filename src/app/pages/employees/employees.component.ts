import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { EmployeesService } from 'src/app/core/services/employees.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;

  validationform: UntypedFormGroup;
  breadCrumbItems: Array<{}>;
  submit: boolean = false;
  isEditing: boolean;
  loading: boolean;
  currentUser: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Kenya];
  dataSource: any = [];

  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  constructor(public formBuilder: UntypedFormBuilder, public authservice: AuthenticationService, public employeeservice: EmployeesService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Employees', active: true }];
    this.currentUser = this.authservice.currentUser();

    this.validationform = this.formBuilder.group({
      Id: 0,
      FullName: ['', [Validators.required]],
      IdNumber: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      Email: ['',[Validators.required, Validators.email]],
      Role: [''],
      Address: ['', [Validators.required]]
    });
    this.getEmployees();
  }
  get form() { return this.validationform.controls; }
  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  successmsg() {
    Swal.fire('Employee Added', 'Employee Added successfully', 'success');
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
        IdNo: data.IdNumber,
        FullName: data.FullName,
        PhoneNo: data.PhoneNumber,
        Email: data.Email,
        Address: data.Address,
        CreatedBy: this.currentUser.Username
      }
      this.employeeservice.InsertOrUpdateEmployees(req)
        .subscribe({
          next: (data) => {
            const response: any = JSON.parse(JSON.stringify(data))
            console.log(response);
            this.successmsg();
            this.getEmployees();
            this.loading = false;
            this.submit = false;
            this.validationform.reset();
            this.validationform.patchValue({ Id: 0 });
          }
        })
    }
    catch (e) {

    }
  }
  hideModal() {
    this.modalRef.hide();
    this.submit = false;
    this.validationform.reset();
    this.validationform.patchValue({ Id: 0 });
  }
  getEmployees() {
    this.loading = true;
    this.employeeservice.GetAllEmployees().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        this.loading = false;
      }
    })
  }
  editEmployee(data) {
    this.loading = true;
    console.log(data);
    this.employeeservice.GetEmployeesById(data.Id).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        console.log(response);
        const req = {
          Id: response.Id,
          IdNumber: response.IdNo,
          FullName: response.FullName,
          PhoneNumber: response.PhoneNo,
          Email: response.Email,
          Address: response.Address
        };
        this.validationform.patchValue(req);
        this.centerModal(this.template);
        this.loading = false;
      }
    })
  }
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to Delete this Employee? ' + data.FullName,
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
          this.employeeservice.DeleteEmployeesById(data.Id)
            .subscribe({
              next: (data) => {
                const response: any = JSON.parse(JSON.stringify(data));
                this.getEmployees();
                this.loading = false;
              }
            });

        } catch (e) {
          this.errormsg(e.message);
          this.loading = false;

        }
        Swal.fire('Deleted', 'Employee Deleted sucessfully.', 'success');
      }
    });
  }
}
