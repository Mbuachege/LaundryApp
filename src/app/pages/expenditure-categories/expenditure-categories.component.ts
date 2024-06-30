import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExpenditureService } from 'src/app/core/services/expenditures.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenditure-categories',
  templateUrl: './expenditure-categories.component.html',
  styleUrls: ['./expenditure-categories.component.css']
})
export class ExpenditureCategoriesComponent implements OnInit {

  constructor(public formBuilder: UntypedFormBuilder, private modalService: BsModalService, public expenditureservices: ExpenditureService, private authservice: AuthenticationService, private http: HttpClient) { }
  /**
   * Returns form
   */
  categoryForm: UntypedFormGroup;
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;

  validationform: UntypedFormGroup;
  isEditing: boolean;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  // bread crumb items
  breadCrumbItems: Array<{}>;
  // Form submition
  currentUser: any;
  submit: boolean;
  submit2: boolean;
  dataSource: any = [];
  CategoryId: any;
  loading: boolean;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Form' }, { label: 'Add Expenditure Category', active: true }];

    this.currentUser = this.authservice.currentUser();

    this.categoryForm = this.formBuilder.group({
      Id: 0,
      Categoryname: ['', [Validators.required]]
    });
    this.getCategories();
  }
  get form() {
    return this.categoryForm.controls;
  }
  get form2() { return this.validationform.controls; }

  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  successmsg() {
    Swal.fire('Expenditure Category Details', 'Expenditure Category Added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Added', msg, 'error');
  }
  hideModal() {
    this.modalRef.hide();
    this.submit2 = false;
    this.validationform.reset();
    this.validationform.patchValue({ Id: 0 });
  }
  validSubmit() {
    this.submit = true;
    if (this.categoryForm.invalid)
      return;
    this.loading = true;
    try {
      const data = this.categoryForm.value;
      const req = {
        Id: data.Id,
        Name: data.Categoryname,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      this.expenditureservices.InsertOrUpdateExpenditureCategories(req).subscribe({
        next: (data) => {
          const response = JSON.parse(JSON.stringify(data));
          this.getCategories();
          this.successmsg();
          this.categoryForm.reset();
          this.categoryForm.patchValue({ Id: 0 });
          this.submit = false;
          this.loading = false;
        }
      });
    }
    catch (ex) {
      this.submit = false;
      this.errormsg(ex.message);
    }
  }
  getCategories() {
    this.loading = true;
    this.expenditureservices.GetAllExpenditureCategories().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        this.loading = false;
      }
    })
  }
  Edit(data) {
    this.loading = true;
    this.expenditureservices.GetExpenditureCategoriesById(data.Id).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        const req = {
          Id: response.Id,
          Categoryname: response.Name
        };
        this.categoryForm.patchValue(req);
        this.loading = false;
      }
    });
  }
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to Delete this ExpenditureCategory? ' + data.Name,
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
          this.expenditureservices.DeleteExpenditureCategoriesById(data.Id)
            .subscribe({
              next: (data) => {
                const response: any = JSON.parse(JSON.stringify(data));
                this.getCategories();
                this.loading = false;
              }
            });

        } catch (e) {
          this.errormsg(e.message);
          this.loading = false;

        }
        Swal.fire('Deleted', 'Category Deleted sucessfully.', 'success');
      }
    });
  }
}
