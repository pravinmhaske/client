import {InjectionToken} from '@angular/core';
import {IAppConfig} from './iapp.config';

export let APP_CONFIG = new InjectionToken('app.config');


export const AppConfig: IAppConfig = {
  routes: {
    productsList: 'products-list/'
  },
  endpoints: {
    //  localhost: 'http://localhost:3000/',
    localhost: 'https://www.selomart.com/',
    productsList: 'get-products',
    productDetails: 'get-prod-details',
    categories: 'get-categories-data',
    allFilters: 'get-filters',
    productUserAction: 'prod-user-action',
    productRating: 'prod-rating/',
    searchProducts: 'search-product',
    similarProducts: 'get-similar-products',
    compareProducts: 'compare-products',
    addOutlet: 'add-new-outlet',
    sendpwd: 'send-pwd',
    saveSellerDetails: 'save-seller-details',
    addProduct: 'add-product',
    addToFav: 'add-to-fav',
    sendLatLong: 'set-lat-long/',
    getFilteredProducts:'get-filtered-products',
    likeProduct:'like-product',
   //sellers endpoints
   sellerDetails: 'seller-details',
   likeSeller:'like-seller',
   //login
   loginUser: 'login',
   registerUser: 'registration'

  },
  votesLimit: 3,
  snackBarDuration: 3000
};
