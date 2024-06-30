import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;
  @ViewChild('submoduleDataModal') submodulestemplate: TemplateRef<HTMLDivElement>;
  validationform: UntypedFormGroup;
  submodulesform:UntypedFormGroup;
  submit: boolean = false;
  submitsubmodule:boolean = false;
  dataSource: any = [];
  submodulesSource:any=[];
  loading: boolean;
  parentId:any;
  currentUser: any;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };

  constructor(public menuservices:MenuService, public authservice: AuthenticationService, private modalService: BsModalService, public formBuilder: UntypedFormBuilder) {

  }
  ngOnInit(): void {
    this.currentUser = this.authservice.currentUser();
    this.validationform = this.formBuilder.group({
      id: 0,
      label: ['', [Validators.required]],
      icon: [''],
      link: ['', [Validators.required]],
      isTitle: false

    });
    this.submodulesform = this.formBuilder.group({
      id: 0,
      label: ['', [Validators.required]],
      icon: [''],
      link: ['', [Validators.required]],
      isTitle: false

    });
    this.GetModules();
  }
  GetModules() {
    this.loading = true;
    this.menuservices.GetModules().subscribe({
      next: (data) => {
        const modulesdata: any = JSON.parse(JSON.stringify(data));
        this.dataSource = modulesdata;
        console.log(this.dataSource);
        this.loading = false;
      }
    });
  }

  successmsg() {
    Swal.fire('Modules Added', 'Modules Added successfully', 'success');
  }
  submdulesuccessmsg() {
    Swal.fire('Sub-Module Added', 'Sub-Module Added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Not Added', msg, 'error');
  }
  get form() { return this.validationform.controls; }
  get submoduleform() { return this.submodulesform.controls; }

  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  subModal(submoduleDataModal: any) {
    this.modalRef = this.modalService.show(submoduleDataModal, this.config);
  }

  GetSubModulesByparentId(parentId)
  {
    this.loading = true;
    this.menuservices.GetSubModulesByparentId(parentId).subscribe({
      next:(data)=>{
        const submodulesdata = JSON.parse(JSON.stringify(data));
        this.submodulesSource = submodulesdata;       
        this.loading = false;
      }
    })
  }
  Loadsubmodules($event) {
    console.log($event.currentSelectedRowKeys[0]);

    this.submodulesSource = [];

    $event.component.collapseAll(-1);

    $event.component.expandRow($event.currentSelectedRowKeys[0]);
    this.GetSubModulesByparentId($event.currentSelectedRowKeys[0]);

  }
  validSubmit() {
    this.submit = true;
    this.currentUser = this.authservice.currentUser();
    if (this.validationform.invalid)
      return;
    try{
      const data = this.validationform.value;
      const req = {
        id:data.id,
        label:data.label,
        icon:data.icon,
        link:data.link,
        isTitle: data.isTitle,
        CreatedBy: this.currentUser.Username,
      };
      console.log(req);
      this.menuservices.InsertOrUpdateModules(req)
      .subscribe({
        next: (data) => {
          const response: any = JSON.parse(JSON.stringify(data))
          console.log(data);
          this.successmsg();
          this.loading = false;
          this.validationform.reset();
          this.validationform.patchValue({id:0});
          this.validationform.patchValue({isTitle:false});
          this.GetModules();
          this.submit = false;
        }
      });
    }
    catch(e)
    {
      this.errormsg(e);
    }
  }
  submoduleSubmit()
  {
    this.submitsubmodule = true;
    this.currentUser = this.authservice.currentUser();
    if (this.submodulesform.invalid)
      return;
    try{
      const data = this.submodulesform.value;
      const req = {
        id:data.id,
        parentId:this.parentId,
        label:data.label,
        icon:data.icon,
        link:data.link,
        isTitle: data.isTitle,
        CreatedBy: this.currentUser.Username,
      };
      console.log(req);
      this.menuservices.InsertOrUpdateSubModules(req)
      .subscribe({
        next: (data) => {
          const response: any = JSON.parse(JSON.stringify(data))
          console.log(data);
          this.submdulesuccessmsg();
          this.loading = false;
          this.submodulesform.reset();
          this.GetSubModulesByparentId(this.parentId);
          this.submodulesform.patchValue({id:0});
          this.submodulesform.patchValue({isTitle:false});
          this.GetModules();
          this.submitsubmodule = false;
        }
      });
    }
    catch(e)
    {
      this.errormsg(e);
    }
  }
  editmodule(data)
  {
   
    this.loading = true;
    this.menuservices.GetModulesById(data.id).subscribe({
      next: (data) =>{
        const modulesdata = JSON.parse(JSON.stringify(data));

        const req = {
          id:modulesdata.id,
          label:modulesdata.label,
          icon:modulesdata.icon,
          link:modulesdata.link,
          isTitle: modulesdata.isTitle,          
        };
        this.validationform.patchValue(req);
        this.centerModal(this.template)
        this.loading = false;
      }
    })
  }
  addSubmodule(data) {
    this.parentId = data.id;
    this.subModal(this.submodulestemplate);

  }
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to delete? ' + data.label,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        this.loading = true;
        try {
          this.menuservices.DeleteModulesById(data.id)
            .subscribe({
              next: (data) => {
                this.GetModules();
                this.loading = false;
              }
            })

        } catch (e) {
          this.loading = false;

        }
        Swal.fire('Deleted', 'Module deleted sucessfully.', 'success');
      }
    });
  }

}
