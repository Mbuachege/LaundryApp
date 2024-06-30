import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-role-details',
  templateUrl: './user-role-details.component.html',
  styleUrls: ['./user-role-details.component.css']
})
export class UserRoleDetailsComponent implements OnInit,AfterViewInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;
  validationform: UntypedFormGroup;
  submit: boolean;
  dataSource: any = [];
  modulesSource:any=[];
  submodulesSource:any=[];
  loading: boolean;
  currentUser: any;
  ModuleId:any;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  @Input() key: number;
  @Input() data: any=[];
  // breadCrumbItems: Array<{}>;

  constructor(public userservice: UserProfileService,public menuservices:MenuService, public authservice: AuthenticationService, private modalService: BsModalService, public formBuilder: UntypedFormBuilder) {

  }
  ngOnInit(): void {
    // this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Sub-Counties', active: true }];
    this.currentUser = this.authservice.currentUser();
    this.validationform = this.formBuilder.group({
      Id: 0,
      ModuleId: ['', [Validators.required]],
      SubModuleId: ['', [Validators.required]],
      Read: ['0'],
      Write: ['0']
    });
    console.log(this.key);
    this.GetSystemRoleDetailsByUserRoleId(this.key);
    this.GetModules();
    this.GetSubModules();
  
  }
  GetModules() {
    this.loading = true;
    this.menuservices.GetModules().subscribe({
      next: (data) => {
        const modulesdata: any = JSON.parse(JSON.stringify(data));
        this.modulesSource = modulesdata;
        console.log(this.dataSource);
        this.loading = false;
      }
    });
  }
  GetSubModules() {
    this.loading = true;
    this.menuservices.GetSubModules().subscribe({
      next: (data) => {
        const submodulesdata = JSON.parse(JSON.stringify(data));
        this.submodulesSource = submodulesdata;
        this.loading = false;
      }
    })
  }
  GetSubModulesByparentId(parentId) {
    this.loading = true;
    this.menuservices.GetSubModulesByparentId(parentId).subscribe({
      next: (data) => {
        const submodulesdata = JSON.parse(JSON.stringify(data));
        this.submodulesSource = submodulesdata;
        this.loading = false;
      }
    })
  }
  onmoduleChange(event: any) {
    this.ModuleId = event.id;
    this.GetSubModulesByparentId(this.ModuleId);
  }
  ngAfterViewInit() {

  }
  GetSystemRoleDetailsByUserRoleId(UserRoleId)
  {
    this.loading = true;
    this.userservice.GetSystemRoleDetailsByUserRoleId(UserRoleId).subscribe({
      next:(data)=>{
        const systemroleDetails = JSON.parse(JSON.stringify(data));
        this.dataSource = systemroleDetails;
        this.data = systemroleDetails;
        this.loading = false;
      }
    });
  }
  successmsg() {
    Swal.fire('success', 'System Role Details added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Not Added', msg, 'error');
  }
  get form() { return this.validationform.controls; }

  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  validSubmit() {
    this.submit = true;
    if (this.validationform.invalid)
      return;
    try{
      const data = this.validationform.value;
      const req = {
        Id: data.Id,
        UserRoleId: this.key,
        ModuleId: data.ModuleId,
        SubModuleId: data.SubModuleId,
        Read: data.Read,
        Write: data.Write,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      this.userservice.InsertOrUpdateSystemRoleDetails(req)
      .subscribe({
        next: (data) => {
          const response: any = JSON.parse(JSON.stringify(data))
          this.successmsg();
          this.loading = false;
          this.validationform.reset();
          this.validationform.patchValue({Id:0});
          this.GetSystemRoleDetailsByUserRoleId(this.key);
          this.submit = false;
        }
      });
    }
    catch(e)
    {
      this.errormsg(e);
    }
  }
  hideModal()
  {
    this.validationform.reset();
    this.modalRef.hide();
  }
  editRoleDetail(data)
  {
   
    this.loading = true;
    this.userservice.GetSystemRoleDetailsById(data.Id).subscribe({
      next: (data) =>{
        const rolesdata = JSON.parse(JSON.stringify(data));

        const req = {
          Id: rolesdata.Id,
          ModuleId: rolesdata.ModuleId,
          SubModuleId: rolesdata.SubModuleId,
          Read: rolesdata.Read,
          Write: rolesdata.Write    
        };
        this.validationform.patchValue(req);
        this.centerModal(this.template);
        this.loading = false;
      }
    })
  }
 
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to delete these Details?',
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
          this.userservice.DeleteSystemRoleDetailsById(data.Id)
            .subscribe({
              next: (data) => {
                this.GetSystemRoleDetailsByUserRoleId(this.key);
                this.loading = false;
              }
            })

        } catch (e) {
          this.loading = false;

        }
        Swal.fire('Deleted', 'System Role Details deleted sucessfully.', 'success');
      }
    });
  }


}

