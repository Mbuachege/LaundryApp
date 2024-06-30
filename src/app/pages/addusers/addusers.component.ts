import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addusers',
  templateUrl: './addusers.component.html',
  styleUrls: ['./addusers.component.css']
})
export class AddusersComponent implements OnInit {
  @ViewChild('centerDataModal') template: TemplateRef<HTMLDivElement>;
  validationform: UntypedFormGroup;
  submit: boolean =false;
  dataSource: any = [];
  userRoles:any=[];
  loading: boolean;
  currentUser: any;
  modalRef?: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered'
  };
  breadCrumbItems: Array<{}>;

  constructor(public usersService: UserProfileService, public authservice: AuthenticationService, private modalService: BsModalService, public formBuilder: UntypedFormBuilder) {

  }
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Users', active: true }];
    this.currentUser = this.authservice.currentUser();
    this.validationform = this.formBuilder.group({
      id: 0,
      Username: ['', [Validators.required]],
      UserRole: ['', [Validators.required]],
      FullName: ['', [Validators.required]],
      PhoneNumber: [''],
      Email: ['', [Validators.required, Validators.email]],
    });
    this.GetAllusers();
  }

  GetAllusers() {
    this.loading = true;
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        const users: any = JSON.parse(JSON.stringify(data));
        this.dataSource = users;
        this.loading = false;
      }
    });
  }
  getUserRoleList() {
    this.loading = true;
    this.usersService.getUserRoleList()
      .subscribe({
        next: (data) => {
          const usergroupdata: any = JSON.parse(JSON.stringify(data));
          this.userRoles = usergroupdata;
          this.loading = false;
        }
      })
  }
  successmsg() {
    Swal.fire('success', 'User added successfully', 'success');
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
        Id: data.id,
        Username: data.Username,
        UserRole: data.UserRole,
        FullName: data.FullName,
        PhoneNumber: data.PhoneNumber,
        MobileNo: data.mobileNo,
        EmployeeNo: data.EmployeeNo,
        Email: data.Email
      };

      console.log(req);
      this.usersService.AddUser(req)
        .subscribe({
          next: (data) => {
            const response: any = JSON.parse(JSON.stringify(data))
            this.successmsg();
            this.loading = false;
            this.validationform.reset();
    this.validationform.patchValue({ Id: 0 });
            this.GetAllusers();
            this.submit = false;
          }
        })
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
  edituser(data)
  {
    this.loading = true;
    this.usersService.getuser(data.Id)
      .subscribe({
        next: (data) => {
          const usersdata: any = JSON.parse(JSON.stringify(data))
          const req = {
            id: usersdata.Id,
            Username: usersdata.Username,
            UserRole: usersdata.UserRole,
            EmployeeNo: usersdata.EmployeeNo,
            FullName: usersdata.FullName,
            PhoneNumber: usersdata.PhoneNumber,
            Email: usersdata.Email,
          }
          this.validationform.patchValue(req);

          this.centerModal(this.template)
          this.loading = false;
        }
      })
  }
 
  resetpassword(data) {
    this.currentUser = this.authservice.currentUser();
    const req = {
      Id: data.Id,
      DoneBy: this.currentUser.Username
    };
    console.log(req);
    Swal.fire({
      title: 'Are you sure you want to Reset Password? ' + data.FullName,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Disable',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        this.loading = true;
        try {
          this.usersService.ResetUserPassword(req)
            .subscribe({
              next: (data) => {
                this.loading = false;
              }
            })

        } catch (e) {
          this.loading = false;

        }
        Swal.fire('Password Reset', 'Password reset done sucessfully.', 'success');
      }
    });
  }
  disableuser(data) {
    this.currentUser = this.authservice.currentUser();
    const req = {
      Id: data.Id,
      DoneBy: this.currentUser.Username
    };
    console.log(req);
    Swal.fire({
      title: 'Are you sure you want to Disable? ' + data.FullName,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, Disable',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        this.loading = true;
        try {
          this.usersService.disableuser(req)
            .subscribe({
              next: (data) => {
                this.GetAllusers();
                this.loading = false;
              }
            })

        } catch (e) {
          this.loading = false;

        }
        Swal.fire('Disabled', 'User Disabled sucessfully.', 'success');
      }
    });
  }

}
