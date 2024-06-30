import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;
  @ViewChild('rolesDataModal') rolestemplate: TemplateRef<HTMLDivElement>;
  validationform: UntypedFormGroup;
  Rolesform: UntypedFormGroup;
  // breadCrumbItems: Array<{}>;
  submit: boolean = false;
  submitRoles: boolean = false;
  isEditing: boolean;
  loading: boolean;
  UserRoleId: any;
  dataSource: any = [];
  modulesSource: any = [];
  systemroleDetailsSource: any = [];
  ModuleId: any;
  currentUser: any;
  submodulesSource: any;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  breadCrumbItems: Array<{}>;

  constructor(public formBuilder: UntypedFormBuilder, public menuservices: MenuService, public authservice: AuthenticationService, public userservices: UserProfileService, private modalService: BsModalService) { }
  // bread crumb items

  ngOnInit() {

    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'System Roles', active: true }];

    this.Rolesform = this.formBuilder.group({
      Id: 0,
      UserRole: ['', [Validators.required]]
    });
    this.validationform = this.formBuilder.group({
      Id: 0,
      ModuleId: ['', [Validators.required]],
      SubModuleId: ['', [Validators.required]],
      Read: false,
      Write: false

    });
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
 
  successmsg() {
    Swal.fire('success', 'System Role added successfully', 'success');
  }
  systemdetailssuccessmsg() {
    Swal.fire('success', 'System Role-Details added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Not Added', msg, 'error');
  }
  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  rolesModal(rolesDataModal: any) {
    this.modalRef = this.modalService.show(rolesDataModal, this.config);
  }
  get form2() { return this.Rolesform.controls; }

  get form() { return this.validationform.controls; }

  addroledetails(data) {
    this.UserRoleId = data.Id;
    this.centerModal(this.template);
  }
  hideModal2() {
    this.Rolesform.reset();
    this.Rolesform.patchValue({ Id: 0 });
    this.Rolesform.patchValue({ Read: false });
    this.Rolesform.patchValue({ Write: false });
    this.modalRef.hide();

  }
  hideModal() {
    this.validationform.reset();
    this.modalRef.hide();
    this.validationform.patchValue({ Id: 0 });
    this.validationform.patchValue({ Read: false });
    this.validationform.patchValue({ Write: false });
  }
  GetSystemRoleDetailsByUserRoleId(UserRoleId) {
    this.loading = true;
    this.userservices.GetSystemRoleDetailsByUserRoleId(UserRoleId).subscribe({
      next: (data) => {
        const systemroleDetails = JSON.parse(JSON.stringify(data));
        this.systemroleDetailsSource = systemroleDetails;
        console.log(this.dataSource);
        this.loading = false;
      }
    });
  }
  LoaduserRoles($event) {
    console.log($event.currentSelectedRowKeys[0]);

    this.systemroleDetailsSource = [];

    $event.component.collapseAll(-1);

    $event.component.expandRow($event.currentSelectedRowKeys[0]);
    this.GetSystemRoleDetailsByUserRoleId($event.currentSelectedRowKeys[0]);

  }
  SubmitRoles() {
    this.submitRoles = true;
    this.currentUser = this.authservice.currentUser();
    if (this.Rolesform.invalid)
      return;
    try {
      const data = this.Rolesform.value;
      const req = {
        Id: data.Id,
        UserRole: data.UserRole,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      
    }
    catch (e) {
      this.errormsg(e);
    }
  }
  validSubmit() {
    this.submit = true;
    this.currentUser = this.authservice.currentUser();
    if (this.validationform.invalid)
      return;
    try {
      const data = this.validationform.value;
      const req = {
        Id: data.Id,
        UserRoleId: this.UserRoleId,
        ModuleId: data.ModuleId,
        SubModuleId: data.SubModuleId,
        Read: data.Read,
        Write: data.Write,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      this.userservices.InsertOrUpdateSystemRoleDetails(req)
        .subscribe({
          next: (data) => {
            const response: any = JSON.parse(JSON.stringify(data))
            this.systemdetailssuccessmsg();
            this.GetSystemRoleDetailsByUserRoleId(this.UserRoleId);
            this.loading = false;
            this.validationform.reset();
            this.validationform.patchValue({ Id: 0 });
            this.validationform.patchValue({ Read: false });
            this.validationform.patchValue({ Write: false });
            this.submit = false;
          }
        });
    }
    catch (e) {
      this.errormsg(e);
    }
  }
  editRole(data) {
    this.isEditing = true;
    this.loading = true;
    // this.userservices.GetSystemRolesById(data.Id).subscribe({
    //   next: (data) => {
    //     const rolesdata = JSON.parse(JSON.stringify(data));

    //     const req = {
    //       Id: rolesdata.Id,
    //       UserRole: rolesdata.UserRole
    //     };
    //     this.Rolesform.patchValue(req);
    //     this.rolesModal(this.rolestemplate);
    //     this.loading = false;
    //   }
    // });
  }

  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to delete ' + data.UserRole + '?',
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
          // this.userservices.DeleteSystemRolesById(data.Id)
          //   .subscribe({
          //     next: (data) => {
          //       this.GetSystemRoles();
          //       this.loading = false;
          //     }
          //   })

        } catch (e) {
          this.loading = false;

        }
        Swal.fire('Deleted', 'System Role deleted sucessfully.', 'success');
      }
    });
  }


}
