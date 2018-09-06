import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Config, NavController } from 'ionic-angular';
import { PopoverController, ToastController, NavParams, Nav, App, Events } from 'ionic-angular';
import { Http } from "@angular/http";
import { Response } from '@angular/http';
//import {FacebookService, LoginResponse, InitParams} from 'ngx-facebook';//facebook
//import {UIParams, UIResponse} from 'ngx-facebook';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Geolocation } from '@ionic-native/geolocation';
import { FavoriteListPage } from '../favorite-list/favorite-list';
import { AboutPage } from '../about/about';
import { ProductsPage } from '../products/products-page';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SellerService, CachedSellerService, SetGetUser, LocationDetails, ProductsService, ToastMessage } from '../../providers/index';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Component({
  selector: 'page-property-list',
  templateUrl: 'seller-details.html'
})
export class SellerDetailsPage implements OnInit {
  /* data variables start */
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(Nav) nav: Nav;
  @ViewChild('outletAddform') outletAddform;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  properties: Array<any>;
  searchKey: string = "";
  viewMode: string = "list";
  map;
  markersGroup;
  blogData: JSON;
  sellerData: any;
  addOutlet: boolean;
  outletsList: any;
  OutletsDataForMultiSelectOptions: Array<JSON>;
  isPickMycurrentLocationSelected: boolean = true;
  isSeller: boolean = false;
  isUserLoggedIn: boolean = false;
  shopId: any;
  calledFrom: string;
  myImgUrl: string = '../assets/img/logo/s.png';
  loggedInUserDetails = {
    isSeller: false, email: "", shopId: "", registrationid: ""
  };
  outlet: any;
  isSellerEditActivated: boolean = false;
  product: any;
  public sellerForm: FormGroup;
  isFormSubmitted: boolean = false;
  public pickMapLocation: boolean = true;
  isMobile: boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  appMenuItems: Array<any> = [
    { title: 'All Products', component: ProductsPage, icon: 'apps' },
    { title: 'Wish list', component: FavoriteListPage, icon: 'heart' },
    { title: 'My Profile', component: SellerDetailsPage, icon: 'contact' },
    { title: 'My Products', component: ProductsPage, icon: 'logo-buffer' },
    { title: 'Login', icon: 'contact' },
    { title: 'Logout', icon: 'log-out' },
    { title: 'About Selomart', component: AboutPage, icon: 'list-box' },
  ];
  //cropper
  name: string;
  data1: any;
  cropperSettings1: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;
  options: any;
  /* data variables ends */
  /* data constructor oninit start */
  constructor(
    private _fb: FormBuilder,
    public navCtrl: NavController,
    public config: Config,
    public http: Http,
    public popoverCtrl: PopoverController,
    public geolocation: Geolocation,
    public productService: ProductsService,
    public locationCache: LocationDetails,
    public toastCtrl: ToastController,
    public userGetterSetter: SetGetUser,
    public navParams: NavParams,
    public sellerService: SellerService,
    //    private fb: FacebookService,
    public cachedSellerDetails: CachedSellerService,
    public events: Events,
    private _app: App,
    private _toastMsg: ToastMessage
  ) {
    this.addOutlet = false;
    this.outlet = {
      location: '',
      city: '',
      address: '',
      zip: '',
      phone: '',
      shopid: '',
      working_hours: '10AM-8PM'
    };
    //facebook
    this.calledFrom = this.navParams.get("calledFrom");
    if (this.calledFrom === 'productspage') {
      this.shopId = this.navParams.get("shopId");
    } else if (this.calledFrom === 'editProduct') {
      this.product = this.navParams.get("product");
      // this.shopId = this.product.shopid;
      this.shopId = this.product.seller.id;
    } else {
      this.shopId = this.navParams.get("shopId");
    }

    //code for image cropper
    this.name = 'Seller Details';
    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.minWidth = 10;
    this.cropperSettings1.minHeight = 10;
    this.cropperSettings1.rounded = false;
    this.cropperSettings1.keepAspect = false;
    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.data1 = {};
  }
  ngOnInit(): any {
    this.sellerForm = this._fb.group({
      contactnumber: ['', [<any>Validators.required]],
      shopname: ['', [<any>Validators.required]],
      website: ['', []],
      shopinfo: ['', [<any>Validators.required]],
      shopOwnerName: ['', [<any>Validators.required]]

    });
    this.getSellerDetailsFromDB();
    let LoggedInUser = this.userGetterSetter.getLoginUser();
    if (LoggedInUser) {
      console.log("in on init", LoggedInUser.isAuthenticatedUser);
      this.isUserLoggedIn = LoggedInUser.isAuthenticatedUser;
      this.isSeller = LoggedInUser.loggedInUserDetails.isSeller;
      this.loggedInUserDetails = LoggedInUser['loggedInUserDetails'];
    }
  }

  /* data constructor oninit ends */
  getSellerDetailsFromDB() {
    this.getSellerDetails()
      .subscribe(response => {
        if (response.success) {
          console.log("seller details")
          this.sellerData = response;
          var outletList = [];
          _.each(this.sellerData.loggedInUserDetails.seller.outlets, function (outlet) {
            outletList.push({
              "id": outlet._id,
              "itemName": outlet.address,
              "mobile": outlet.mobile,
              "workinghrs": outlet.workinghrs
            });
          });
          this.outletsList = outletList;
          // this.outletLocations(this.sellerData.loggedInUserDetails.seller.outlets);
          let SellerDetails = this.userGetterSetter.getLoginUser();
          this.loggedInUserDetails = SellerDetails.loggedInUserDetails;
          this.shopId = SellerDetails.loggedInUserDetails.shopId;
          this.sellerForm.controls['contactnumber'].setValue(this.sellerData.loggedInUserDetails.mobile);
          this.sellerForm.controls['shopname'].setValue(this.sellerData.loggedInUserDetails.seller.shopname);
          this.sellerForm.controls['shopinfo'].setValue(this.sellerData.loggedInUserDetails.seller.shopinfo);
          this.sellerForm.controls['shopOwnerName'].setValue(this.sellerData.loggedInUserDetails.seller.shopowner);
          //    this.sellerForm.controls['website'].setValue(this.sellerData.loggedInUserDetails.seller[0].shopname);
          this.isSeller = (this.sellerData.loggedInUserDetails.seller._id === SellerDetails.loggedInUserDetails.shopId &&
            SellerDetails.loggedInUserDetails.isSeller);
          console.log("in get this.isSeller ", this.isSeller);
        } else {
          this._toastMsg.showToastMessage("There was some problem while connectiong to server.Please try again.");
        }
      }, err => this.handleError(err))
  }
  editSellerDetails(e) {
    this.isSellerEditActivated = true;
    e.stopPropagation();
  }

  saveSellerDetails() {
    this.isFormSubmitted = true;
    if (this.sellerForm.valid) {
      //addititonal values for seller  
      var sellerDataObj = new Object();
      sellerDataObj["shopId"] = this.shopId;
      sellerDataObj["imgbanner"] = this.data1.image;
      sellerDataObj["shopname"] = $("#shopname").val();
      sellerDataObj["contactnumber"] = $("#contactnumber").val();
      sellerDataObj["shopinfo"] = $("#shopinfo").val();
      sellerDataObj["shopowner"] = $("#shopOwnerName").val();
      sellerDataObj["shopwebsite"] = $("#shopwebsite").val();
      sellerDataObj["establishmentdate"] = $("#establishmentdate").val();
      sellerDataObj["registrationid"] = this.loggedInUserDetails.registrationid;
      this.sellerService.saveSellerDetails(sellerDataObj)
        .subscribe(response => {
          if (response.success && response.recordsupdated > 0) {
            this._toastMsg.showToastMessage("Your details saved successfully.");
            this.isSellerEditActivated = false;
            this.getSellerDetailsFromDB();
          } else {
            this._toastMsg.showToastMessage("There was some problem while registering user.Please try again.");
          }
        }, err => this.handleError(err))

    } else {
      this._toastMsg.showToastMessage("Registration form is not valid.Please check details and try again.");
    }
  }

  share(url: string) {
    console.log("in facebook share");
  }

  getSellerDetails() {
    let loggedInUser = this.userGetterSetter.getLoginUser();
    if (loggedInUser.loggedInUserDetails.isSeller && this.calledFrom === undefined) {
      return this.sellerService.getSellerDetails(loggedInUser.loggedInUserDetails.shopId);
    } else {
      return this.sellerService.getSellerDetails(this.shopId);
    }
  }
  public handleError(error: Response) {
    this._toastMsg.showToastMessage("There was some problem while connecting to server.Please try again.");
    console.error(error);
    return Observable.throw('Server error');
    //    return Observable.throw(error.json().error || 'Server error');
  }
  sharebtnClick() {
    console.log('share click');
  }


  addShopOutlet(contactnumber, working_hours) {
    this.outlet.shopid = this.sellerData.loggedInUserDetails._id;
    this.outlet.phone = contactnumber.trim();
    this.outlet.working_hours = working_hours.trim();
    var locationDetails = this.locationCache.getLocation();
    if (this.pickMapLocation && locationDetails) {
      this.outlet.address = locationDetails.address ? locationDetails.address : this.outlet.address;
      this.outlet.location = locationDetails.location ? locationDetails.location : this.outlet.location;
      this.outlet.city = locationDetails.city ? locationDetails.city : this.outlet.city;
      this.outlet.zip = locationDetails.zip ? locationDetails.zip : this.outlet.zip;
    }
    this.saveOutlet();
  }
  saveOutlet() {
    this.productService.addShopOutlet(this.outlet).subscribe((response) => {
      if (response.success) {
        this._toastMsg.showToastMessage(response.message);
        this.outletAddform.reset();
      } else {
        this._toastMsg.showToastMessage(response.message);
      }
    });
  }

  selectLocationChoices(event) {
    if ($(event.target).text() === 'From Google Maps') {
      $($(event.target).parent().children()[0]).removeClass('notActive');
      $($(event.target).parent().children()[0]).addClass('active');
      $($(event.target).parent().children()[1]).removeClass('active');
      $($(event.target).parent().children()[1]).addClass('notActive');
      this.pickMapLocation = true;
    } else {
      $($(event.target).parent().children()[1]).removeClass('notActive');
      $($(event.target).parent().children()[1]).addClass('active');
      $($(event.target).parent().children()[0]).removeClass('active');
      $($(event.target).parent().children()[0]).addClass('notActive');
      this.pickMapLocation = false;
    }
  }

  addOutletCLick(event) {
    this.addOutlet = this.addOutlet ? false : true;
    event.stopPropagation();
    // if (this.addOutlet)
    //     this.pickMyCurrentLocation();
  }

  editOutletInfo(outlet) {
    this.outlet = {
      location: outlet.location,
      city: outlet.city,
      address: outlet.address,
      zip: outlet.zip,
      phone: outlet.mobile,
      shopid: outlet.outletid,
      working_hours: outlet.workinghrs
    };
    this.addOutlet = this.addOutlet ? false : true;
    //var temArrOfLocation = outlet.location.split(",");
    var temArrOfLocation;
    if (outlet.location) temArrOfLocation = outlet.location.split(",");
  }
  //image cropper

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }

  fileChangeListener($event) {
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);

    };

    myReader.readAsDataURL(file);
  }
  //facebook share

  openPage(page, event) {
    if (page.title === "Logout") {
      let LoggedInUser = {
        isAuthenticatedUser: false,
        loggedInUserDetails: {
          isSeller: false,
          email: "",
          shopId: "",
          registrationid: ""
        }
      };
      this.userGetterSetter.setLoginUser(LoggedInUser);
      this._app.getRootNav().setRoot(ProductsPage);
    } else if (page.title === "Login") {
      this.events.publish('user:loginClicked');
      event.stopPropagation();
    } else if (page.title === "My Products") {
      let seller = this.userGetterSetter.getLoginUser();
      this.cachedSellerDetails.setShopInfo(seller.loggedInUserDetails.shopId);
      if (seller.loggedInUserDetails.isSeller) {
        this.cachedSellerDetails.setShopInfo(seller.loggedInUserDetails.isSeller);
        this._app.getRootNav().setRoot(ProductsPage);
      }
    } else {
      this._app.getRootNav().setRoot(page.component);
    }
  }

  likeSellerClick() {
    let userDetails = this.userGetterSetter.getLoginUser();
    if (userDetails.isAuthenticatedUser) {
      this.likeSeller(userDetails.loggedInUserDetails.registrationid);
    } else {
      this._toastMsg.showToastMessage("Please login to like this seller.");
    }
  }
  likeSeller(userId) {
    this.sellerService.likeSeller(userId)
      .subscribe((response) => {
        if (response.success) {
          this._toastMsg.showToastMessage(response.message);
          // this.getProducts();
        } else {
          this._toastMsg.showToastMessage(response.message);
        }
      });
  }
}//class ends here