import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
    constructor(private http: HttpClient) { }

    //Begin Employees
    InsertOrUpdateEmployees(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateEmployees', req);
    }
    GetEmployeesById(Id) {
        return this.http.get(environment.apiurl + '/GetEmployeesById/' + Id);
    }
    GetAllEmployees() {
        return this.http.get(environment.apiurl + '/GetAllEmployees');
    }
    DeleteEmployeesById(Id) {
        return this.http.delete(environment.apiurl + '/DeleteEmployeesById/' + Id);
    }
    //End Employees

     
}