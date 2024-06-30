import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CategoryService } from 'src/app/core/services/categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor(public formBuilder: UntypedFormBuilder, private modalService: BsModalService, private categoryservice: CategoryService, private authservice: AuthenticationService, private http: HttpClient) { }
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
  filteredData = [];
  submit: boolean;
  submit2: boolean;
  dataSource: any = [];
  CategoryId: any;
  loading: boolean;
  files: File[] = [];
  imageUrl: string | undefined;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Form' }, { label: 'Add Clothes Category', active: true }];
    this.currentUser = this.authservice.currentUser();

    this.categoryForm = this.formBuilder.group({
      Id: 0,
      Categoryname: ['', [Validators.required]]
    });
    this.validationform = this.formBuilder.group({
      Id: 0,
      FabricType: ['', [Validators.required]],
      Color: ['', [Validators.required]],
      CareInstructions: [''],
      Price:['', [Validators.required]]
    });
    this.getCategories();
    this.getimage();
  }
  get form() {
    return this.categoryForm.controls;
  }
  get form2() { return this.validationform.controls; }

  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  successmsg() {
    Swal.fire('Category Added', 'Category Added successfully', 'success');
  }
  subCategorysuccessmsg() {
    Swal.fire('Sub-Category Added', 'Sub-Category Added successfully', 'success');
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
  searchTableList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredData = this.dataSource.filter(item => {
      return item.Id.toString().toLowerCase().includes(searchTerm) ||
        item.Name.toLowerCase().includes(searchTerm) ||
        item.CreatedBy.toLowerCase().includes(searchTerm) ||
        item.DateCreated.toLowerCase().includes(searchTerm);
    });
  }
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }
  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        console.log(file);
        this.categoryservice.saveImage(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;

            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the image!';
            }

            this.currentFile = undefined;
          },
        });
      }

      this.selectedFiles = undefined;
    }
  }
  getimage() {
    this.categoryservice.GetImage().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        console.log(response);
      }
    });
  }
  AddSubCategories(data) {
    this.CategoryId = data.Id;
    this.centerModal(this.template);
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
        CategoryId: this.CategoryId,
        FabricType: data.FabricType,
        Color: data.Color,
        CareInstructions: data.CareInstructions,
        Price:data.Price,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      this.categoryservice.InsertOrUpdateClothesSubCategories(req).subscribe({
        next: (data) => {
          const response = JSON.parse(JSON.stringify(data));
          this.loading = false;
          this.submit2 = false;
          this.validationform.reset();
          this.validationform.patchValue({ Id: 0 });
          this.subCategorysuccessmsg();
        }
      })
    }
    catch (ex) {
      this.errormsg(ex.message);
    }
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
      this.categoryservice.InsertOrUpdateClothesCategories(req).subscribe({
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
    this.categoryservice.GetAllClothesCategories().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        this.filteredData = this.dataSource;
        this.loading = false;
      }
    })
  }
  GetClothesCategoriesById(data) {
    this.loading = true;
    this.categoryservice.GetClothesCategoriesById(data.Id).subscribe({
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
      title: 'Are you sure you want to Delete this Category? ' + data.Name,
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
          this.categoryservice.DeleteClothesCategoriesById(data.Id)
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
