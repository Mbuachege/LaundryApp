import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpenditureService {
    constructor(private http: HttpClient) { }
    //Begin Expenditure
    InsertOrUpdateExpenditure(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateExpenditure', req);
    }
    GetExpenditureById(Id) {
        return this.http.get(environment.apiurl + '/GetExpenditureById/' + Id);
    }
    GetAllExpenditures() {
        return this.http.get(environment.apiurl + '/GetAllExpenditures');
    }
    DeleteExpenditureById(Id) {
        return this.http.delete(environment.apiurl + '/DeleteExpenditureById/' + Id);
    }
    //End Expenditure

    //Begin ExpenditureCategories
    InsertOrUpdateExpenditureCategories(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateExpenditureCategories', req);
    }
    GetAllExpenditureCategories() {
        return this.http.get(environment.apiurl + '/GetAllExpenditureCategories');
    }
    GetExpenditureCategoriesById(Id) {
        return this.http.get(environment.apiurl + '/GetExpenditureCategoriesById/' + Id);
    }
    DeleteExpenditureCategoriesById(Id) {
        return this.http.delete(environment.apiurl + '/DeleteExpenditureCategoriesById/' + Id);
    }
    //End ExpenditureCategories
}