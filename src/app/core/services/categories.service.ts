import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    constructor(private http: HttpClient) { }
    public societyId() {
        if (!sessionStorage.getItem('societyId')) {
            return null;
        }
        return JSON.parse(sessionStorage.getItem('societyId'));
    }
    //Begin ClothesCategories
    InsertOrUpdateClothesCategories(req)
    {
        return this.http.post(environment.apiurl + '/InsertOrUpdateClothesCategories',req);
    }
    saveImage(req)
    {
        return this.http.post(environment.apiurl + '/saveImage',req);
    }
    GetImage() {
        return this.http.get(environment.apiurl + '/GetImage');
    }
    GetClothesCategoriesById(Id) 
    {
        return this.http.get(environment.apiurl + '/GetClothesCategoriesById/' +  Id);
    }
    GetAllClothesCategories() {
        return this.http.get(environment.apiurl + '/GetAllClothesCategories');
    }
    DeleteClothesCategoriesById(Id) 
    {
        return this.http.delete(environment.apiurl + '/DeleteClothesCategoriesById/' +  Id);
    }
    //End ClothesCategories

    //Begin ClothesSubCategories
    InsertOrUpdateClothesSubCategories(req)
    {
        return this.http.post(environment.apiurl + '/InsertOrUpdateClothesSubCategories',req);
    }
    GetClothesSubCategoriesById(Id) 
    {
        return this.http.get(environment.apiurl + '/GetClothesSubCategoriesById/' +  Id);
    }
    GetClothesSubCategoriesByCategoryId(CategoryId) 
    {
        return this.http.get(environment.apiurl + '/GetClothesSubCategoriesByCategoryId/' +  CategoryId);
    }
    DeleteClothesSubCategoriesById(Id) 
    {
        return this.http.delete(environment.apiurl + '/DeleteClothesSubCategoriesById/' +  Id);
    }
    //End ClothesSubCategories

     //Begin ServiceCategories
     InsertOrUpdateServiceCategories(req)
     {
         return this.http.post(environment.apiurl + '/InsertOrUpdateServiceCategories',req);
     }
     GetAllServiceCategories() {
        return this.http.get(environment.apiurl + '/GetAllServiceCategories');
    }
    GetServiceCategoriesById(Id) 
     {
         return this.http.get(environment.apiurl + '/GetServiceCategoriesById/' +  Id);
     }
     DeleteServiceCategoriesById(Id) 
     {
         return this.http.delete(environment.apiurl + '/DeleteServiceCategoriesById/' +  Id);
     }
     //End ServiceCategories

     
    //Begin ServiceSubCategories
    InsertOrUpdateServiceSubCategories(req)
    {
        return this.http.post(environment.apiurl + '/InsertOrUpdateServiceSubCategories',req);
    }
    GetServiceSubCategoriesById(Id) 
    {
        return this.http.get(environment.apiurl + '/GetServiceSubCategoriesById/' +  Id);
    }
    GetServiceSubCategoriesByCategoryId(CategoryId) 
    {
        return this.http.get(environment.apiurl + '/GetServiceSubCategoriesByCategoryId/' +  CategoryId);
    }
    DeleteServiceSubCategoriesById(Id) 
    {
        return this.http.delete(environment.apiurl + '/DeleteServiceSubCategoriesById/' +  Id);
    }
    //End ServiceSubCategories
}