import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';


import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
  submitted:boolean = false;
  loading = false;
  error:string = '';
  returnUrl: string;
  fieldTextType!: boolean;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    public toastService: ToastrService) {
 this.toastService.toastrConfig

     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
console.log(this.loginForm);



    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (this.loginForm.valid) {
        this.loading = true;
  
        this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password)
          .subscribe({
            next: (data) => {
  
              if (data.Token == null) {
  
                this.toastService.error('Invalid username or password', 'Login',{timeOut:3000,closeButton:true,progressBar:true});
              
              
              } else {
  
                this.router.navigate(['/dashboard']);
                this.loading = false;
              }
  
            },
            error: (e) => {
              console.log(e);
              
  
              this.toastService.error(e, 'Login',{timeOut:3000,closeButton:true,progressBar:true});
  
              this.loading = false;
  
            },
            complete: () => {
              this.loading = false;
            }
          })
      }




     
       
    }
  }
}
