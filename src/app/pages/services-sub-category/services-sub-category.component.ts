import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CategoryService } from 'src/app/core/services/categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services-sub-category',
  templateUrl: './services-sub-category.component.html',
  styleUrls: ['./services-sub-category.component.css']
})
export class ServicesSubCategoryComponent implements OnInit, AfterViewInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;
  @Input() key: number;
  dataSource: any = [];
  loading: boolean;
  validationform: UntypedFormGroup;
  currentUser: any;
  submit2: boolean;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };

  constructor(public formBuilder: UntypedFormBuilder, private modalService: BsModalService, private categoryservice: CategoryService,
    private authservice: AuthenticationService, private http: HttpClient) { }

  ngOnInit(): void {
    this.currentUser = this.authservice.currentUser();
    this.validationform = this.formBuilder.group({
      Id: 0,
      Title: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      CareInstructions: [''],
      Description: ['']
    });
    this.GetServiceSubCategoriesByCategoryId(this.key);
  }
  ngAfterViewInit(): void {
    this.GetServiceSubCategoriesByCategoryId(this.key);
  }
  GetServiceSubCategoriesByCategoryId(CategoryId) {
    this.loading = true;
    this.categoryservice.GetServiceSubCategoriesByCategoryId(CategoryId).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        this.loading = false;
      }
    })
  }
  get form2() { return this.validationform.controls; }

  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }

  subCategorysuccessmsg() {
    Swal.fire('Sub-Category Added', 'Sub-Category Added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Added', msg, 'error');
  }
  edit(data) {
    this.loading = true;
    this.categoryservice.GetServiceSubCategoriesById(data.Id).subscribe({
      next: (data) => {
        const subCategories = JSON.parse(JSON.stringify(data));
        const req = {
          Id: subCategories.Id,
          Title: subCategories.Title,
          Price:subCategories.Price,
          CareInstructions: subCategories.CareInstructions,
          Description: subCategories.Description
        };
        this.validationform.patchValue(req);
        this.centerModal(this.template);
        this.loading = false;
      }
    })
  }
  validSubmitSubCategory() {
    this.submit2 = true;
    this.loading = true;
    if (this.validationform.invalid)
      return;
    try {
      const data = this.validationform.value;
      const req = {
        Id: data.Id,
        CategoryId: this.key,
        Title: data.Title, 
        Price:data.Price,
        CareInstructions: data.CareInstructions,
        Description: data.Description,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      this.categoryservice.InsertOrUpdateServiceSubCategories(req).subscribe({
        next: (data) => {
          const response = JSON.parse(JSON.stringify(data));
          this.loading = false;
          this.submit2 = false;
          this.validationform.reset();
          this.GetServiceSubCategoriesByCategoryId(this.key);
          this.validationform.patchValue({ Id: 0 });
          this.subCategorysuccessmsg();
        }
      })
    }
    catch (ex) {
      this.errormsg(ex.message);
    }
  }
  hideModal() {
    this.modalRef.hide();
    this.validationform.reset();
    this.validationform.patchValue({ Id: 0 });
  }
  delete(data) {
    Swal.fire({
      title: 'Are you sure you want to Delete this Sub-Category?',
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
          this.categoryservice.DeleteServiceSubCategoriesById(data.Id)
            .subscribe({
              next: (data) => {
                const response: any = JSON.parse(JSON.stringify(data));
                this.GetServiceSubCategoriesByCategoryId(this.key);
                this.loading = false;
              }
            });

        } catch (e) {
          this.errormsg(e.message);
          this.loading = false;

        }
        Swal.fire('Deleted', 'Sub Category Deleted sucessfully.', 'success');
      }
    });
  }

}
