import { Inject, Injectable} from '@angular/core';
import { Http} from '@angular/http';
import {APP_CONFIG} from '../app/config/app.config';
import {IAppConfig} from '../app/config/iapp.config';
// import { Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import { Observable } from 'rxjs/Rx';

@Injectable()
export class CachedSellerService {
  shopInfo: string;
  constructor(private http:Http, @Inject(APP_CONFIG) private appConfig: IAppConfig) {

  }
  getShopInfo() {
    var tempShopId = this.shopInfo;
    this.shopInfo = '';
    return tempShopId;
  }
  setShopInfo(shopInfo: string) {
    this.shopInfo = shopInfo;
  }

}