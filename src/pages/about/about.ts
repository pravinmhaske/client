import {Component, ViewChild} from '@angular/core';
import {NavController, Nav, App, Events} from 'ionic-angular';
import { SellerDetailsPage } from '../seller/seller-details';
import {ProductsPage} from '../products/products-page';
import { SetGetUser } from '../../providers/set-loggedin-user.service';
import { CachedSellerService } from '../../providers/cached-seller';
import {FavoriteListPage} from '../favorite-list/favorite-list';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})

export class AboutPage {
  @ViewChild(Nav) nav: Nav;
  favorites: Array<any>;
  isMobile: boolean = false;
  loggedInUserDetails = {};
  isUserLoggedIn: Boolean = false;
  isSeller: Boolean = false;
  appMenuItems = [
    {title: 'All Products', component: ProductsPage, icon: 'apps'},
    {title: 'Wish list', component: FavoriteListPage, icon: 'heart'},
    {title: 'My Profile', component: SellerDetailsPage, icon: 'contact'},
    {title: 'My Products', component: ProductsPage, icon: 'logo-buffer'},
    {title: 'Login', icon: 'contact'},
    {title: 'Logout', icon: 'log-out'},
    {title: 'About Selomart', component: AboutPage, icon: 'list-box'},
  ];
  constructor(
    public navCtrl: NavController, 
    public events: Events,
    public _app: App,
    public userGetterSetter: SetGetUser,
    public cachedSellerDetails: CachedSellerService
  ) {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  ngOnInit() {
    let LoggedInUser = this.userGetterSetter.getLoginUser();
    if (LoggedInUser) {
      console.log("in on init", LoggedInUser.isAuthenticatedUser);
      this.isUserLoggedIn = LoggedInUser.isAuthenticatedUser;
      this.isSeller = LoggedInUser.loggedInUserDetails.isSeller;
      this.loggedInUserDetails = LoggedInUser['loggedInUserDetails'];
    }
  }

  openPage(page,event) {
    if(page.title === "Logout") {
      let LoggedInUser = {
        isAuthenticatedUser: false,
        loggedInUserDetails: {
          isSeller: false,
          email: "",
          shopId: "",
          registrationid:""
        }
      };
      this.userGetterSetter.setLoginUser(LoggedInUser);
      this._app.getRootNav().setRoot(ProductsPage);
    } else if(page.title === "Login") {
      this.events.publish('user:loginClicked');
      event.stopPropagation();
    } else if(page.title === "My Products") {
      let seller = this.userGetterSetter.getLoginUser();
      this.cachedSellerDetails.setShopInfo(seller.loggedInUserDetails.shopId);
      if(seller.loggedInUserDetails.isSeller) {
          this.cachedSellerDetails.setShopInfo(seller.loggedInUserDetails.isSeller);
          this._app.getRootNav().setRoot(ProductsPage);
      }
    } else {
      this._app.getRootNav().setRoot(page.component);
    }
  }
}
