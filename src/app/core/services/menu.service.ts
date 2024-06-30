import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
    constructor(private http: HttpClient) { }

    //Begin Modules
    InsertOrUpdateModules(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateModules', req);
    }
    GetModulesById(Id) {
        return this.http.get(environment.apiurl + '/GetModulesById/' + Id);
    }
    GetModules() {
        return this.http.get(environment.apiurl + '/GetModules');
    }
    DeleteModulesById(Id) {
        return this.http.delete(environment.apiurl + '/DeleteModulesById/' + Id);
    }
    //End Modules

    //Begin SubModules
    InsertOrUpdateSubModules(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateSubModules', req);
    }
    GetSubModulesById(Id) {
        return this.http.get(environment.apiurl + '/GetSubModulesById/' + Id);
    }
    GetSubModulesByparentId(parentId) {
        return this.http.get(environment.apiurl + '/GetSubModulesByparentId/' + parentId);
    }
    GetSubModules() {
        return this.http.get(environment.apiurl + '/GetSubModules');
    }
    DeleteSubModulesById(Id) {
        return this.http.delete(environment.apiurl + '/DeleteSubModulesById/' + Id);
    }
    //End SubModules
}