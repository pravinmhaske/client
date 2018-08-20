import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class CategoriesService {
    /* data variables */
    private _categoryData: JSON;
    /*constructor*/
    constructor(private http: Http) {  }
    /*member fucnctions*/
    getCategoryData() {
        return this._categoryData;
    }
    setCategoryData(categoryData: JSON) {
        this._categoryData = categoryData;
    }

}