import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.css']
})
export class UserGroupsComponent implements OnInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;
  @ViewChild('userGroupDataModal') userGrouptemplate: TemplateRef<HTMLDivElement>;
  validationform: UntypedFormGroup;
  userGroupform:UntypedFormGroup;
  submit: boolean =false;
  submitgroup:boolean = false;
  isEditing: boolean;
  loading: boolean;
  UserGroupId:any;
  currentUser: any;
  dataSource:any=[];
  usersRoles:any=[];
  groupRolesSource:any=[];
  breadCrumbItems: Array<{}>;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  
  constructor(public formBuilder: UntypedFormBuilder,public authservice: AuthenticationService, public usersService:UserProfileService,private modalService: BsModalService) { }
  // bread crumb items

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'User-Groups', active: true }];
    this.userGroupform = this.formBuilder.group({
      Id: 0,
      Name: ['', [Validators.required]]
    });
    this.validationform = this.formBuilder.group({
      Id: 0,
      UserRoleId: ['', [Validators.required]]

    });
    this.GetUserGroups();
    this.GetSystemRoles();
  }
  GetUserGroups() {
    this.loading = true;
    // this.usersService.GetUserGroup().subscribe({
    //   next: (data) => {
    //     const usergroups: any = JSON.parse(JSON.stringify(data));
    //     this.dataSource = usergroups;
    //     this.loading = false;
    //   }
    // });
  }
  GetSystemRoles() {
    this.loading = true;
    // this.usersService.GetSystemRoles().subscribe({
    //   next: (data) => {
    //     const roles: any = JSON.parse(JSON.stringify(data));
    //     this.usersRoles = roles;
    //     this.loading = false;
    //   }
    // });
  }
  successmsg() {
    Swal.fire('success', 'UserGroup added successfully', 'success');
  }
  groupRolesuccessmsg() {
    Swal.fire('success', 'User-Group Role added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Not Added', msg, 'error');
  }
  centerModal(centerDataModal: any) {
    this.modalRef = this.modalService.show(centerDataModal, this.config);
  }
  userGroupModal(userGroupDataModal: any) {
    this.modalRef = this.modalService.show(userGroupDataModal, this.config);
  }
  get form2() { return this.userGroupform.controls; }

  get form() { return this.validationform.controls; }

  addGroupRoles(data) {
    this.UserGroupId = data.Id;
    this.centerModal(this.template);
  }
  GetUserGroupRolesByGroupId(UserGroupId)
  {
    this.loading = true;
    // this.usersService.GetUserGroupRolesByGroupId(UserGroupId).subscribe({
    //   next:(data)=>{
    //     const groupRoles = JSON.parse(JSON.stringify(data));
    //     this.groupRolesSource = groupRoles;     
    //     this.loading = false;
    //   }
    // })
  }
  LoaduserGroupDetails($event) {
    console.log($event.currentSelectedRowKeys[0]);

    this.groupRolesSource = [];

    $event.component.collapseAll(-1);

    $event.component.expandRow($event.currentSelectedRowKeys[0]);
    this.GetUserGroupRolesByGroupId($event.currentSelectedRowKeys[0]);

  }
  hideModal()
  {
    this.validationform.reset();
    this.modalRef.hide();
  }
  hideModal2()
  {
    this.userGroupform.reset();
    this.modalRef.hide();
  }
  submitusergroup() {
    this.submitgroup = true;
    this.currentUser = this.authservice.currentUser();
    if (this.userGroupform.invalid)
      return;
    try{
      const data = this.userGroupform.value;
      const req = {
        Id:data.Id,
        Name:data.Name,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      // this.usersService.InsertOrUpdateUserGroup(req)
      // .subscribe({
      //   next: (data) => {
      //     const response: any = JSON.parse(JSON.stringify(data))
      //     console.log(data);
      //     this.successmsg();
      //     this.GetUserGroups();
      //     this.loading = false;
      //     this.submitgroup = false;
      //     this.isEditing = false;
      //     this.userGroupform.reset();
      //     this.userGroupform.patchValue({Id:0});        
      //   }
      // });
    }
    catch(e)
    {
      this.errormsg(e);
    }
  }
  validSubmit() {
    this.submit = true;
    this.currentUser = this.authservice.currentUser();
    if (this.validationform.invalid)
      return;
    try{
      const data = this.validationform.value;
      const req = {
        Id:data.Id,
        UserGroupId:this.UserGroupId,
        UserRoleId:data.UserRoleId,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
      // this.usersService.InsertOrUpdateUserGroupRole(req)
      // .subscribe({
      //   next: (data) => {
      //     const response: any = JSON.parse(JSON.stringify(data))
      //     this.groupRolesuccessmsg();
      //     this.GetUserGroups();
      //     this.loading = false;
      //     this.validationform.reset();
      //     this.validationform.patchValue({Id:0});
      //     this.GetUserGroupRolesByGroupId(this.UserGroupId);
      //     this.submit = false;
      //   }
      // });
    }
    catch(e)
    {
      this.errormsg(e);
    }
  }
  editGroupRole(data)
  {
   this.isEditing = true;
   this.currentUser = this.authservice.currentUser();
    // this.usersService.GetUserGroupById(data.Id).subscribe({
    //   next: (data) =>{
    //     const usergroups = JSON.parse(JSON.stringify(data));

    //     const req = {
    //       Id:usergroups.Id,
    //       Name:usergroups.Name             
    //     };
    //     this.userGroupform.patchValue(req);
    //     this.userGroupModal(this.userGrouptemplate);
    //   }
    // })
  }
 
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to delete ' + data.Name + '?',
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
          // this.usersService.DeleteUserGroupById(data.Id)
          //   .subscribe({
          //     next: (data) => {
          //       this.GetUserGroups();
          //       this.loading = false;
          //     }
          //   })

        } catch (e) {
          this.loading = false;

        }
        Swal.fire('Deleted', 'User-Group deleted sucessfully.', 'success');
      }
    });
  }

}
