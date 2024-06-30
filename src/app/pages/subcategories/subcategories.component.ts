import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CategoryService } from 'src/app/core/services/categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit, AfterViewInit {
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
      FabricType: ['', [Validators.required]],
      Color: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      CareInstructions: ['']
    });
    this.getSubcategotyById(this.key);
  }
  ngAfterViewInit(): void {
    this.getSubcategotyById(this.key);
  }
  getSubcategotyById(CategoryId) {
    this.loading = true;
    this.categoryservice.GetClothesSubCategoriesByCategoryId(CategoryId).subscribe({
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
    this.categoryservice.GetClothesSubCategoriesById(data.Id).subscribe({
      next: (data) => {
        const subCategories = JSON.parse(JSON.stringify(data));
        const req = {
          Id: subCategories.Id,
          FabricType: subCategories.FabricType,
          Price: subCategories.Price,
          Color: subCategories.Color,
          CareInstructions: subCategories.CareInstructions
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
        FabricType: data.FabricType,
        Price: data.Price,
        Color: data.Color,
        CareInstructions: data.CareInstructions,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      this.categoryservice.InsertOrUpdateClothesSubCategories(req).subscribe({
        next: (data) => {
          const response = JSON.parse(JSON.stringify(data));
          this.loading = false;
          this.submit2 = false;
          this.validationform.reset();
          this.getSubcategotyById(this.key);
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
          this.categoryservice.DeleteClothesSubCategoriesById(data.Id)
            .subscribe({
              next: (data) => {
                const response: any = JSON.parse(JSON.stringify(data));
                this.getSubcategotyById(this.key);
                this.loading = false;
              }
            });

        } catch (e) {
          this.errormsg(e.message);
          this.loading = false;

        }
        Swal.fire('Deleted', 'Sub-Category Deleted sucessfully.', 'success');
      }
    });
  }

}
