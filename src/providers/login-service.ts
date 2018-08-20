import {EventEmitter, Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {APP_CONFIG} from '../app/config/app.config';
import {IAppConfig} from '../app/config/iapp.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class LoginService {
    request$: EventEmitter<any>;
    private headers;
    private localhost;
    private endpoints;
    // private loading ;
    private handleError(error: any): Promise<any> {
    // this.request$.emit('finished');
    return Promise.reject(error.message || error);
  }

  constructor(private http: Http,
         @Inject(APP_CONFIG) private appConfig: IAppConfig,
         public loadingCtrl: LoadingController,
        ) {
      // this.headers = new Headers({'Content-Type': 'application/json'});
      this.headers = new Headers({
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			});
      this.request$ = new EventEmitter();
      this.localhost = this.appConfig.endpoints.localhost;
      this.endpoints = this.appConfig.endpoints;

  }

  registerUser(registerDataObj): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return  this.http.post(this.localhost + this.endpoints.registerUser, JSON.stringify(registerDataObj),
        // return  this.http.post("http://localhost:3000/" + "registration", JSON.stringify(registerDataObj),
    new RequestOptions({ headers: this.headers }))
      .map(response => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }

  loginUser(loginDataObj): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return  this.http.post(this.localhost + this.endpoints.loginUser, JSON.stringify(loginDataObj),
    // return  this.http.post("http://localhost:3000/login", JSON.stringify(loginDataObj),
    new RequestOptions({ headers: this.headers }))
      .map(response => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }
}
