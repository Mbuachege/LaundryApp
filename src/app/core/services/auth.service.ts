import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EncryptDecrypt  } from '../helpers/encrypt_decrypt';
 
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })

export class AuthenticationService {

 

    constructor(
        private http: HttpClient,private encrypt: EncryptDecrypt
    ) {
    }

    /**
     * Returns the current user
     */
    public currentUser() {
        if (!sessionStorage.getItem('authUser')) {
            return null;
        }
        return JSON.parse(sessionStorage.getItem('authUser'));
    }

    /**
     * Performs the auth
     * @param username email of user
     * @param password password of user
     */
    login(username: string, password: string) {
        const getHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
          });
        return this.http.post<any>( environment.apiurl + '/Authenticate',
         { Username: username, Password: password }, {headers: getHeaders })
            .pipe(map(user => {

                // login successful if there's a jwt token in the response
                if (user.Token != null) {
                    sessionStorage.setItem('authUser', JSON.stringify(user));
                } else {
                    sessionStorage.removeItem('authUser');
                }

                return user;
            }));
    }

 

 

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        localStorage.removeItem('authUser');
    }

    resetPassword(email:any) {
        
    }
}

