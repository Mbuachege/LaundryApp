import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProcessService {
    constructor(private http: HttpClient) { }
    //Begin Processes
    InsertOrUpdateProcesses(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateProcesses', req);
    }
    GetProcessesById(Id) {
        return this.http.get(environment.apiurl + '/GetProcessesById/' + Id);
    }
    GetAllProcesses() {
        return this.http.get(environment.apiurl + '/GetAllProcesses');
    }
    DeleteProcessesById(Id) {
        return this.http.delete(environment.apiurl + '/DeleteProcessesById/' + Id);
    }
    //End Processes
}