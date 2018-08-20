import { Http, Headers, RequestOptions } from '@angular/http';
import {APP_CONFIG} from '../app/config/app.config';
import {IAppConfig} from '../app/config/iapp.config';
import { Observable } from 'rxjs/Observable';
import { Inject, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export interface ISetGetUser{
    isAuthenticatedUser:boolean;
    loggedInUserDetails:{
        isSeller:boolean;
        email:string;
        shopId:string;
        registrationid:string;
     }
}

@Injectable()
export class SetGetUser implements ISetGetUser {
    public isAuthenticatedUser;
    private endpoints: any;
    private headers: any;
    private handleError(error: any): Promise<any> {
        // this.request$.emit('finished');
        return Promise.reject(error.message || error);
    }
    public loggedInUserDetails:{
        isSeller:boolean;
        email:string;
        shopId:string,
        registrationid:string
     }
    private LoggedInUser = {
   isAuthenticatedUser:false,
    loggedInUserDetails:{
        isSeller:false,
        email:"",
        shopId:"",
        registrationid:""
     }
};

constructor(private http: Http, @Inject(APP_CONFIG) private appConfig: IAppConfig) {
    // this.headers = new Headers({'Content-Type': 'application/json'});
    this.headers = new Headers({
              'Access-Control-Allow-Origin' : '*',
              'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          });
    this.endpoints = this.appConfig.endpoints;
}

    setLoginUser(loggedInUser: ISetGetUser) {  
        this.LoggedInUser =loggedInUser;
        sessionStorage.setItem("LoggedInUser", JSON.stringify(this.LoggedInUser));
       //this.isUserLoggedIn=isAuthenticatedUser;
    }

    getLoginUser() {
        if(sessionStorage.getItem('LoggedInUser')===null)
            return  this.LoggedInUser;
        else
            return JSON.parse(sessionStorage.getItem('LoggedInUser'));
    }

    sendPassword(email: string): Observable<any> {
        
        return this.http.post(this.endpoints.localhost + this.endpoints.sendpwd, JSON.stringify({mail: email}),
        new RequestOptions({ headers: this.headers }))
        .map((response) => {
          return response.json();
        })
        .catch(this.handleError);
    }
    sendLatLong(latLong: string, outletId: string) {
        return this.http.post(this.endpoints.localhost + this.endpoints.sendLatLong, {latLong:latLong, outletId: outletId},
            new RequestOptions({ headers: this.headers }))
        .map((response) => {
            console.log(response);
        })
        .catch(this.handleError);
    }
}