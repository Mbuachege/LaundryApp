import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { EncryptDecrypt  } from '../helpers/encrypt_decrypt';

import { environment } from '../../../environments/environment';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,private encrypt: EncryptDecrypt) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
        
        
            const currentUser = this.authenticationService.currentUser();
            if (currentUser)
            {
                const _user = currentUser;
                console.log(_user);
                
                if (_user && _user.Token) {
                    console.log(_user.Token);
                    
                    request = request.clone({
                        setHeaders: {
                            Token: ` ${_user.Token}`
                        }
                    });
                }

            }



           
        
        return next.handle(request);
    }
}
