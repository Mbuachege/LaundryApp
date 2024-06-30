import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomersService {
    constructor(private http: HttpClient) { }

   //Begin Customers
   InsertOrUpdateCustomers(req) {
    return this.http.post(environment.apiurl + '/InsertOrUpdateCustomers', req);
}
GetCustomersById(Id) {
    return this.http.get(environment.apiurl + '/GetCustomersById/' + Id);
}
GetAllCustomers() {
    return this.http.get(environment.apiurl + '/GetAllCustomers');
}
DeleteCustomersById(Id) {
    return this.http.delete(environment.apiurl + '/DeleteCustomersById/' + Id);
}
//End Customers
}