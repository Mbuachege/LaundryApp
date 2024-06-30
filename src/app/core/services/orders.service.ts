import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    constructor(private http: HttpClient) { }

    //Begin Employees
    InsertOrder(req) {
        return this.http.post(environment.apiurl + '/InsertOrder', req);
    }
    GetAllOrders() {
        return this.http.get(environment.apiurl + '/GetAllOrders');
    }

    InsertOrderDetails(req) {
        return this.http.post(environment.apiurl + '/InsertOrderDetails', req);
    }
    GetAllOrderDetails(OrderId) {
        return this.http.get(environment.apiurl + '/GetAllOrderDetails/' + OrderId);
    }
}