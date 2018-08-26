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
export class ProductsService {
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

  getAllProducts(shopId: any,pageNumber:number): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
//    return this.http.get(this.localhost + this.endpoints.productsList + shopId,new RequestOptions({ headers: this.headers }))
      // return this.http.get("http://localhost:3000/get-products/?productid="+ shopId+"&pageNumber="+pageNumber,new RequestOptions({ headers: this.headers }))
  return this.http.get(this.localhost + this.endpoints.productsList+"/?shopId="+ shopId+"&pageNumber="+pageNumber,new RequestOptions({ headers: this.headers }))
      .map(response => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }
  
  getFilteredProducts(data): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    // return this.http.get(this.localhost + this.endpoints.getFilteredProducts+"/?productid="+ shopId+"&pageNumber="+pageNumber+"&query="+query,new RequestOptions({ headers: this.headers }))
    return this.http.post(this.localhost + this.endpoints.getFilteredProducts, data,
      new RequestOptions({ headers: this.headers }))
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss());
  }

  getProdDetails(data: any): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    // return this.http.get(this.localhost + this.endpoints.productDetails + JSON.stringify(data),
      return this.http.get(this.localhost + this.endpoints.productDetails+"?productid="+data,
      new RequestOptions({ headers: this.headers }))
      .map((response) => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }

  getCategories(): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
   return this.http.get(this.localhost + this.endpoints.categories,new RequestOptions({ headers: this.headers }))
      // return this.http.get("http://localhost:3000/get-categories-data",new RequestOptions({ headers: this.headers }))

      .map(response => {
        return response.json();
      })
      .catch(this.handleError)
      .finally(() =>loading.dismiss())
  }

  likeProduct(productId): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.http.post(this.localhost + this.endpoints.likeProduct,{productId:productId},new RequestOptions({ headers: this.headers }))
    .map(response => {
      return response.json();
    })
    .catch(this.handleError)
    .finally(() =>loading.dismiss())
  }

  userAction(productId: any, userId: any, actionPerformed: string): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.http.post(this.localhost + this.endpoints.productUserAction, {productid: productId, userId: userId, action: actionPerformed},
      new RequestOptions({ headers: this.headers }))
        .map(response => {
          return response;
        })
        .catch(this.handleError)
        .finally(() =>loading.dismiss())
  }

  rateProduct(productRating: any): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.http.post(this.localhost + this.endpoints.productRating, productRating,
      new RequestOptions({ headers: this.headers }))
        .map(response => {
          return response;
        })
        .catch(this.handleError)
        .finally(() =>loading.dismiss())
  }

  findSimilar(data: any): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.http.post(this.localhost+this.endpoints.similarProducts, data,
    new RequestOptions( {headers: this.headers} ))
    .map(response => {
      return response.json();
    })
    .catch(this.handleError)
    .finally(() =>loading.dismiss());
  }
  addProductToFav(data) {
    return this.http.post(this.localhost + this.endpoints.addToFav, data,
      new RequestOptions({headers: this.headers})).map(response => {
        return response.json();
    }).catch(this.handleError);
  }
  addShopOutlet(data: any): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
   return this.http.post(this.localhost + this.endpoints.addOutlet, data,
        // return this.http.post("http://localhost:3000/add-new-outlet", data,
      new RequestOptions({ headers: this.headers }))
        .map(response => {
          return response.json();
        })
        .catch(this.handleError)
        .finally(() =>loading.dismiss())
  }

  compareProducts(list: any): Observable<any> {
    let loading = this.loadingCtrl.create();
    loading.present();
    return this.http.post(this.localhost + this.endpoints.compareProducts, list,
    new RequestOptions( {headers: this.headers} ))
    .map(response => {
      return response.json();
    })
    .catch(this.handleError)
    .finally(() =>loading.dismiss());
  }
}
