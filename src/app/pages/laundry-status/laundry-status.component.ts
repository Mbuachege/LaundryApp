import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ProcessService } from 'src/app/core/services/process.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-laundry-status',
  templateUrl: './laundry-status.component.html',
  styleUrls: ['./laundry-status.component.css']
})
export class LaundryStatusComponent implements OnInit {

  constructor(public formBuilder: UntypedFormBuilder, private http: HttpClient, private processService: ProcessService, private authservice: AuthenticationService) { }
  /**
   * Returns form
   */
  get form() {
    return this.processForm.controls;
  }

  processForm: UntypedFormGroup;
  loading: boolean;
  currentUser: any;
  dataSource:any=[];
  breadCrumbItems: Array<{}>;
  // Form submition
  submit: boolean;
  files: File[] = [];

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Form' }, { label: 'Process/status', active: true }];
    this.currentUser = this.authservice.currentUser();
    this.processForm = this.formBuilder.group({
      Id: 0,
      processname: ['', [Validators.required]],
      Duration: ['', [Validators.required]]
    });
    this.GetAllProcess();
    this.submit = false;
  }
  successmsg() {
    Swal.fire('Status/Process Added', 'Status/Process Added successfully', 'success');
  }
  errormsg(msg) {
    Swal.fire('Record Added', msg, 'error');
  }
  validSubmit() {
    this.submit = true;
    if (this.processForm.invalid)
      return;
    this.loading = true;
    try {
      const data = this.processForm.value;
      const req = {
        Id: data.Id,
        Process: data.processname,
        Duration: data.Duration,
        CreatedBy: this.currentUser.Username
      };
      this.processService.InsertOrUpdateProcesses(req).subscribe({
        next: (data) => {
          const response = JSON.parse(JSON.stringify(data));
          this.successmsg();
          this.submit = false;
          this.GetAllProcess();
          this.processForm.reset();
          this.processForm.patchValue({ Id: 0 });
        }
      })
    }
    catch (ex) {
      this.errormsg(ex.message);
    }
  }
  GetAllProcess() {
    this.loading = true;
    this.processService.GetAllProcesses().subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        this.dataSource = response;
        console.log(this.dataSource);
        this.loading = false;
      }
    })
  }
  GetProcessById(data) {
    this.loading = true;
    this.processService.GetProcessesById(data.Id).subscribe({
      next: (data) => {
        const response = JSON.parse(JSON.stringify(data));
        const req = {
          Id: response.Id,
          processname: response.Process,
          Duration: response.Duration
        };
        this.processForm.patchValue(req);
        this.loading = false;
      }
    })
  }
  Delete(data) {
    Swal.fire({
      title: 'Are you sure you want to Delete this Process/Status? ' + data.Process,
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
          this.processService.DeleteProcessesById(data.Id)
            .subscribe({
              next: (data) => {
                const response: any = JSON.parse(JSON.stringify(data));
                this.GetAllProcess();
                this.loading = false;
              }
            });

        } catch (e) {
          this.errormsg(e.message);
          this.loading = false;

        }
        Swal.fire('Deleted', 'Process/Status Deleted sucessfully.', 'success');
      }
    });
  }
}
