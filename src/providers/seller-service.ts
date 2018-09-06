import {EventEmitter, Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {APP_CONFIG} from '../app/config/app.config';
import {IAppConfig} from '../app/config/iapp.config';
// import { Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class SellerService {
    request$: EventEmitter<any>;
    private headers;
    private localhost;
    private endpoints;
    // private loading ;
    private handleError(error: any): Promise<any> {
    // this.request$.emit('finished');
    console.log("Error ="+error)
    console.log("error.message ="+error.message)
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

  saveSellerDetails(sellerDataObj): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return  this.http.post(this.localhost+this.endpoints.saveSellerDetails, JSON.stringify(sellerDataObj),
    new RequestOptions({ headers: this.headers }))
      .map(response => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }

  addEditProduct(product): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
   return  this.http.post(this.localhost+this.endpoints.addProduct, JSON.stringify(product),
       // return  this.http.post("http://localhost:3000/add-product", JSON.stringify(product),
    new RequestOptions({ headers: this.headers }))
      .map(response => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }

  getSellerDetails(sellerId: any): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();

return this.http.get(this.localhost + this.endpoints.sellerDetails+"?sellerid="+sellerId)
// return this.http.get("http://localhost:3000/seller-details?sellerid="+sellerId)

      .map(response => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }

  likeSeller(userId): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.http.post(this.localhost + this.endpoints.likeSeller,{userId:userId},new RequestOptions({ headers: this.headers }))
    .map(response => {
      return response.json();
    })
    .catch(this.handleError)
    .finally(() =>loading.dismiss())
  }



}
