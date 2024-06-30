import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ExpenditureService } from 'src/app/core/services/expenditures.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.css']
})
export class ExpendituresComponent implements OnInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;

  validationform: UntypedFormGroup;
  breadCrumbItems: Array<{}>;
  submit: boolean = false;
  isEditing: boolean;
  CategoryId: any;
  currentuser: any;
  loading: boolean;
  CategoriesSource: any = [];
  dataSource: any = [];
  maxDate: Date = new Date();

  modalRef?: BsModalRef;
  config = {
    backdrop: true,     
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  constructor(public formBuilder: UntypedFormBuilder, public authservice: AuthenticationService, public expenditureservices: ExpenditureService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Expenditures', active: true }];
    this.currentuser = this.authservice.currentUser();
    this.validationform = this.formBuilder.group({
      Id: 0,
      CategoryName: ['', Validators.required],
      Amount: ['', [Validators.required]],
      paymentReference: [''],
      Date: [new Date(), [Validators.required]],
      Description: ['']
    });
    this.getCategories();
    this.GetAllExpenditures();
  }
  get form2() { return this.validationform.controls; }

  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  successmsg() {
    Swal.fire('Expenditure Details', 'Expenditure Details Added Successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Expenditure Details', msg, 'error');
  }
  onCategoryChange(event: any):void{
    this.CategoryId = event.Id;
  }
  getCategories() {
    this.loading = true;
    this.expenditureservices.GetAllExpenditureCategories().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.CategoriesSource = response;
        this.loading = false;
      }
    })
  }
  validSubmit() {
    this.submit = true;
    if (this.validationform.invalid)
      return;
    try {
      this.loading = true;
      const data = this.validationform.value;
      const date = new Date(data.Date);

      const EntryDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
      const dateString = `${EntryDate.year}-${EntryDate.month}-${EntryDate.day}`;
      const formattedDate = moment(dateString, 'YYYY-M-D').format('YYYY-MM-DD');

      const req = {
        Id: data.Id,
        Reference: data.paymentReference,
        CategoryId: data.CategoryName,
        Amount: data.Amount,
        Date: formattedDate,
        Description: data.Description,
        CreatedBy: this.currentuser.Username
      };
      console.log(req);
      this.expenditureservices.InsertOrUpdateExpenditure(req).subscribe({
        next: (data) => {
          const response = JSON.parse(JSON.stringify(data));
          this.submit = false;
          this.successmsg();
          this.GetAllExpenditures();
          this.validationform.reset();
          this.validationform.patchValue({ Id: 0 });
          this.loading = false;
        }
      });
    }
    catch (ex) {
      this.errormsg(ex.message);
    }
  }
  GetAllExpenditures() {
    this.loading = true;
    this.expenditureservices.GetAllExpenditures().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        this.loading = false;
      }
    })
  }
  edit(data) {
    this.loading = true;
    this.expenditureservices.GetExpenditureById(data.Id).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        console.log(response);

        const date = new Date(response.Date);

      const EntryDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
      const dateString = `${EntryDate.year}-${EntryDate.month}-${EntryDate.day}`;
      const formattedDate = moment(dateString, 'YYYY-M-D').format('YYYY-MM-DD');

        const req = {
          Id: response.Id,
          CategoryName:parseInt(response.CategoryId),
          Amount: response.Amount,
          paymentReference: response.Reference,
          Date:new Date(response.Date),
          Description: response.Description
        };
        this.validationform.patchValue(req);
        console.log(this.validationform.value);
        this.centerModal(this.template);
        this.loading = false;
      }
    })
  }
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to Delete this Expenditure? ' + data.CategoryName,
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
          this.expenditureservices.DeleteExpenditureById(data.Id)
            .subscribe({
              next: (data) => {
                const response: any = JSON.parse(JSON.stringify(data));
                this.GetAllExpenditures();
                this.loading = false;
              }
            });

        } catch (e) {
          this.errormsg(e.message);
          this.loading = false;

        }
        Swal.fire('Deleted', 'Expenditure Deleted sucessfully.', 'success');
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
