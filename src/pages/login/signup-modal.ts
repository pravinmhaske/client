
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Headers} from '@angular/http';
import {SetGetUser} from '../../providers/set-loggedin-user.service';
import {LoginService} from '../../providers/login-service';
import {LocationDetails} from '../../providers/location-details';
import {Events, ToastController, ViewController, IonicPage, LoadingController} from 'ionic-angular';
import * as $ from 'jquery';
import {Geolocation} from '@ionic-native/geolocation';
//import { FacebookService, UIParams, UIResponse,LoginResponse ,InitParams } from 'ngx-facebook';

@IonicPage()
@Component({
  selector: 'page-signup-modal',
  templateUrl: 'signup-modal.html'
})
export class SignupModalPage implements OnInit {
  /* data variables start */
  @ViewChild('f') signupform;
  public signUpForm: FormGroup;
  public pickMapLocation: boolean = true;
  public isRegistrationsFormSubmitted: boolean;
  public forgetPwd: boolean = false;
  public headers: Headers;
  public user = {
    isAuthenticatedUser: false,
    loggedInUserDetails: {isSeller: false, email: "", shopId: "", registrationid: ""}
  };
  private isSeller: Boolean = false;
  model: any = {};
  loading = false;
  /* data variables ends */
  /* data constructor oninit start */
  constructor(
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    public events: Events,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private _fb: FormBuilder,
    private locationDetails: LocationDetails,
    private loginService: LoginService,
    public userGetterSetter: SetGetUser) {}

  ngOnInit() {
    this.signUpForm = this._fb.group({
      contactnumber: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.email]],
      shopname: ['', [<any>Validators.required]],
      ownername: ['', []],
      website: ['', []],
      lat_long_details: ['', []],
      address: ['', []],
      city: ['', []],
      zip: ['', []],
      working_hours: ['10AM-8PM', []],
      password: ['', [<any>Validators.required]]
    });
    var loginContainer = document.getElementsByTagName('ion-scroll');
    if(loginContainer) {
      this.setLoginContainerHeight();
    } else {
      setTimeout(this.setLoginContainerHeight, 1000);
    }
  }

  setLoginContainerHeight() {
    if(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
      document.getElementsByTagName('ion-scroll')[0]['style'].height = '90vh';
    else
      document.getElementsByTagName('ion-scroll')[0]['style'].height = '445px';
  }
  /* data constructor oninit start */
  loginWithFb() {
    //       this.fb.login()
    //                 .then((response: LoginResponse) => {
    //                     alert("You have signed in successfully. Response from facebook ="+JSON.stringify(response));
    //                     console.log("response"+response)
    //                 })
    //                 .catch((error: any) => console.error("error"+error));
    let toast = this.toastCtrl.create({
      message: 'This functionality is under construction.Please try to login with your credentials.',
      duration: 2000
    });
    toast.present(toast);

  }

  loginWithGmail() {
    let toast = this.toastCtrl.create({
      message: 'This functionality is under construction..Please try to login with your credentials.',
      duration: 2000
    });
    toast.present(toast);
  }

  registerUser(model: any, isValid: boolean) {
    this.isRegistrationsFormSubmitted = true;
    var registarionRequestObj = new Object();
    var okToSubmitRequest = false;
    let toast = this.toastCtrl.create({
      message: '',
      cssClass: 'mytoast',
      duration: 2000
    });
    if (this.isSeller && isValid) {
      registarionRequestObj["contactnumber"] = model.contactnumber;
      registarionRequestObj["email"] = model.email;
      registarionRequestObj["password"] = model.password;
      registarionRequestObj["isSeller"] = this.isSeller;
      registarionRequestObj["shopname"] = model.shopname;
      registarionRequestObj["shopownername"] = model.ownername;
      registarionRequestObj["website"] = model.website;
      registarionRequestObj["working_hours"] = model.working_hours;
      registarionRequestObj["display_contact_number"] = true;
      let storeLocation = this.locationDetails.getLocation();
      if (this.pickMapLocation && storeLocation !== undefined) {
        registarionRequestObj["address"] = storeLocation.address;
        registarionRequestObj["lat_long_details"] = storeLocation.location;
        registarionRequestObj["city"] = storeLocation.city;
        registarionRequestObj["zip"] = storeLocation.zip;
        okToSubmitRequest = true;
      } else if (this.pickMapLocation && storeLocation === undefined) {

      } else {
        registarionRequestObj["address"] = model.address;
        registarionRequestObj["city"] = model.city;
        registarionRequestObj["zip"] = model.zip;
        okToSubmitRequest = true;
      }

    } else if (!this.isSeller && (model.contactnumber !== '' && model.password !== '' && model.email !== '')) {
      registarionRequestObj["contactnumber"] = model.contactnumber;
      registarionRequestObj["email"] = model.email;
      registarionRequestObj["password"] = model.password;
      registarionRequestObj["isSeller"] = this.isSeller;
      okToSubmitRequest = true;
    }
    if (okToSubmitRequest) {
      let loading = this.loadingCtrl.create();
      loading.present();
      //here code 
      this.loginService.registerUser(registarionRequestObj)
        .subscribe((response) => {
          loading.dismiss();
          var response = response;
          if (response.success) {
            if (response.isUsernameAlreadyPresent) {
              //                            this.dismiss();
              toast.data.message = response.message;
              toast.present(toast);
            } else {
              if (response.rowsInserted > 0) {
                this.dismiss();
                toast.data.message = response.message;
                toast.present(toast);
              } else {
                //                                this.dismiss();
                toast.data.message = response.message;
                toast.present(toast);
              }
            }
          } else {
            toast.data.message = response.message;
            toast.present(toast);
            this.dismiss();
          }
        })

    } else {
      //    this.dismiss();
      toast.data.message = "Provide required fields.Please check details and try again.";
      toast.present(toast);
    }
  }
  loginUser(username: string, password: string) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.isRegistrationsFormSubmitted = true;
    let toast = this.toastCtrl.create({
      message: '',
      cssClass: 'mytoast',
      duration: 2000
    });
    var loginRequestObj = new Object();
    loginRequestObj["contactnumber"] = username.trim();
    loginRequestObj["password"] = password.trim();
    this.loginService.loginUser(loginRequestObj)
      .subscribe((response) => {
        loading.dismiss();
        var result = response;
        if (result.success) {
          if (result.isAuthenticatedUser) {
            this.user.isAuthenticatedUser = result.isAuthenticatedUser;
            if (result.loggedInUserDetails.isseller) {
              this.user.loggedInUserDetails = {
                isSeller: result.loggedInUserDetails.isseller,
                email: result.loggedInUserDetails.email,
                shopId: result.loggedInUserDetails.seller._id,
                registrationid: result.loggedInUserDetails._id
              };

            }

            this.userGetterSetter.setLoginUser(this.user);
            this.events.publish('user:userdetails', this.user);
            this.dismiss();
            toast.data.message = response.message;
            toast.present(toast);
          } else {
            //this.dismiss();
            toast.data.message = response.message;
            toast.present(toast);
          }
        } else {
          toast.data.message = result.message;
          toast.present(toast);
          this.dismiss();
        }
      });
  }

  sendPwdToMail(email: string) {
    let toast = this.toastCtrl.create({
      message: '',
      cssClass: 'mytoast',
      duration: 2000
    });
    if (email !== "" && email !== undefined) {
      if (this.validateEmail(email)) {
        this.userGetterSetter.sendPassword(email).subscribe(response => {
          toast.data.message = response.message;
          toast.present(toast);
          this.dismiss();
        });
      } else {
        toast.data.message = 'Please provide valid email address.';
        toast.present(toast);
      }
    } else {
      toast.data.message = 'Please provide your registered email address.';
      toast.present(toast);
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  handleError(error) {
    let toast = this.toastCtrl.create({
      message: '',
      cssClass: 'mytoast',
      duration: 2000
    });

    toast.data.message = "There was some problem while connecting to server.Please try after some time.";
    toast.present(toast);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getIsSellerCheckboxInput(event) {
    if ($(event.target).text() === 'NO') {
      console.log('No');
      $($(event.target).parent().children()[1]).removeClass('notActive');
      $($(event.target).parent().children()[1]).addClass('active');
      $($(event.target).parent().children()[0]).removeClass('active');
      $($(event.target).parent().children()[0]).addClass('notActive');
      this.isSeller = false;
    } else {
      console.log('Yes');
      $($(event.target).parent().children()[0]).removeClass('notActive');
      $($(event.target).parent().children()[0]).addClass('active');
      $($(event.target).parent().children()[1]).removeClass('active');
      $($(event.target).parent().children()[1]).addClass('notActive');
      this.isSeller = true;
    }
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
}
