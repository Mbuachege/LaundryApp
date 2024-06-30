import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/store/Authentication/auth.models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }
    getAll() {
        return this.http.get<User[]>(`/api/login`);
    }
    getAllUsers() {
        return this.http.get(environment.apiurl + '/users');
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }
    AddUser(req) {
        return this.http.post(environment.apiurl + '/users', req);
    }
    ChangePassword(req) {
        return this.http.post(environment.apiurl + '/ChangePassword', req);
    }
    ResetUserPassword(req) {
        return this.http.post(environment.apiurl + '/ResetUserPassword', req);
    }
    disableuser(req) {
        return this.http.post(environment.apiurl + '/disableuser', req);
    }
    AddUserRole(req) {
        return this.http.post(environment.apiurl + '/UserRole', req);
    }
    getUserRoleList() {
        return this.http.get(environment.apiurl + '/UserRoleList');
    }
    RemoveUserRole(req) {
        return this.http.post(environment.apiurl + '/RemoveUserRole', req);
    }
    getuser(id) {
        return this.http.get(environment.apiurl + '/getuser/' + id);
    }
    Connect() {
        return this.http.get(environment.apiurl + '/Connect');
    }

     //UserGroup
     getAllUserGroup() {
        return this.http.get(environment.apiurl + '/UserGroups');
    }
    AddUUserGroup(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateUserGroup', req);
    }
    RemoveUserGroup(Id) {
        return this.http.delete(environment.apiurl + '/DeleteUserGroupById/' + Id);
    }
    //End UserGroup

    //UserRoleDetails
    InsertOrUpdateSystemRoleDetails(req) {
        return this.http.post(environment.apiurl + '/InsertOrUpdateSystemRoleDetails', req);
    }
    GetSystemRoleDetailsByUserRoleId(UserRoleId) {
        return this.http.get(environment.apiurl + '/GetSystemRoleDetailsByUserRoleId/' + UserRoleId);
    }
    GetSystemRoleDetailsById(Id) {
        return this.http.get(environment.apiurl + '/GetSystemRoleDetailsById/' + Id);
    }
    DeleteSystemRoleDetailsById(id) {
        return this.http.delete(environment.apiurl + '/DeleteSystemRoleDetailsById/' + id);
    }
    //End UserRoleDetails
}
