import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usergrouproles',
  templateUrl: './usergrouproles.component.html',
  styleUrls: ['./usergrouproles.component.css']
})
export class UsergrouprolesComponent implements OnInit, AfterViewInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;
  @ViewChild('menuDataModal') menutemplate: TemplateRef<HTMLDivElement>;
  @Input() key: number;
  @Input() data: any=[];
  validationform: UntypedFormGroup;
  breadCrumbItems: Array<{}>;
  submit: boolean =false;
  menusubmit:boolean = false;
  dataSource: any = [];
  usersRoles:any=[];
  loading: boolean;
  parentId:any;
  currentUser: any;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };

  constructor(public usersService:UserProfileService, public authservice: AuthenticationService, private modalService: BsModalService, public formBuilder: UntypedFormBuilder) {

  }
  ngOnInit(): void {
    this.currentUser = this.authservice.currentUser();
    this.validationform = this.formBuilder.group({
      Id: 0,
      UserRoleId: ['', [Validators.required]]

    });
    

  }
  ngAfterViewInit() {

  }
 
 
  successmsg() {
    Swal.fire('Group Role Added', 'Group Role Added successfully', 'success');
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
    this.currentUser = this.authservice.currentUser();
    if (this.validationform.invalid)
      return;
    try{
      const data = this.validationform.value;
      const req = {
        Id:data.Id,
        UserGroupId:this.key,
        UserRoleId:data.UserRoleId,
        CreatedBy: this.currentUser.Username
      };
      console.log(req);
     
    }
    catch(e)
    {
      this.errormsg(e);
    }
  }
  
  editgrouprole(data)
  {


  }
 
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to delete this Group Role? ',
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
          // this.usersService.DeleteUserGroupRoleById(data.Id)
          //   .subscribe({
          //     next: (data) => {
          //       this.GetUserGroupRolesByGroupId(this.key);
          //       this.loading = false;
          //     }
          //   })

        } catch (e) {
          this.loading = false;

        }
        Swal.fire('Deleted', 'Group Role deleted sucessfully.', 'success');
      }
    });
  }

}
