import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { APP_CONFIG, AppConfig } from './config/app.config';
import { MyApp } from './app.component';
import { FavoriteListPage } from '../pages/favorite-list/favorite-list';
import { AboutPage } from '../pages/about/about';
import { CommonModule } from '@angular/common';
import { Ionic2RatingModule } from 'ionic2-rating';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { ProductsPage } from '../pages/products/products-page';
import { ProductDetailsPage } from '../pages/product-detail/product-details';
import { CompareProductsPage } from '../pages/compare-products/compare-products';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoryModalPageModule } from '../pages/category-modal/category-modal.module'; //lazy loaded
// import {SignupModalPage} from '../pages/login/signup-modal/signup-modal';
//import {SignupModalPageModule} from '../pages/login/signup-modal/signup-modal.module';
import { FilterModalPage } from '../pages/filter-modal/filter-modal';
import { FilterModalPageModule } from '../pages/filter-modal/filter-modal.module';
import { Geolocation } from '@ionic-native/geolocation';
// import { CallNumber } from '@ionic-native/call-number';
import { SellerDetailsPage } from '../pages/seller/seller-details';
import { PaginationPage } from '../pages/pagination/pagination';
import { AddProductsPage } from '../pages/seller/add-products/add-products';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { MapMarkersPageModule } from '../pages/maps/map-markers.module';
import { DisplayMapPageModule } from '../pages/maps/displaymap/display-map.module';

// import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { ImageCropperModule } from 'ng2-img-cropper';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TooltipModule } from "ngx-tooltip"; //tooltip module
import { FacebookModule } from 'ngx-facebook';
/* provider */
import {
  SellerService, AddProductsSpecification, CachedSellerService, CategoriesService,
  LocationDetails, LoginService, PagerService, ProductsService, SetGetUser,ToastMessage
} from "../providers/index";
/* pipes */
import { OrderByPipe, SearchPipe, TitleCasePipe } from '../pipes/index';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ProductsPage,
    ProductDetailsPage,
    SearchPipe,
    TitleCasePipe,
    CompareProductsPage,
    OrderByPipe,
    FavoriteListPage,
    SellerDetailsPage, AddProductsPage, PaginationPage
    //  ImageCropperComponent
  ],
  imports: [
    MapMarkersPageModule,
    DisplayMapPageModule,
    BrowserModule,
    HttpModule,
    RouterModule,
    AutoCompleteModule,
    CommonModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCwGlG6B4cTvLrer3UITUBVM7cSxk8bYQ4",
      libraries: ["places"],
      language: 'en',
      region: 'IN'
    }),
    AgmSnazzyInfoWindowModule,
    Ionic2RatingModule, AngularMultiSelectModule,
    FacebookModule.forRoot(),
    TooltipModule,
    CategoryModalPageModule,
    FilterModalPageModule,
    ImageCropperModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // WelcomePage,
    ProductsPage,
    ProductDetailsPage,
    CompareProductsPage,
    AboutPage,
    FavoriteListPage,
    //CategoryModalPage,
    // SignupModalPage,
    FilterModalPage,
    SellerDetailsPage, AddProductsPage
  ],
  providers: [
    SetGetUser,
    StatusBar,
    SplashScreen,
    SellerService,
    ProductsService,
    CachedSellerService,
    AddProductsSpecification,
    LocationDetails,
    LoginService,
    Geolocation,
    PagerService,CategoriesService,ToastMessage,
    // CallNumber,
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
