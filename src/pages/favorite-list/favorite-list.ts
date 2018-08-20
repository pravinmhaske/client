import {Component, ViewChild} from '@angular/core';
import {NavController, Nav, App, Events} from 'ionic-angular';
import {AboutPage} from '../about/about';
import { SellerDetailsPage } from '../seller/seller-details';
import { ProductsPage } from '../products/products-page';
import { SetGetUser } from '../../providers/set-loggedin-user.service';
import { CachedSellerService } from '../../providers/cached-seller';

@Component({
    selector: 'page-favorite-list',
    templateUrl: 'favorite-list.html'
})
export class FavoriteListPage {
    @ViewChild(Nav) nav: Nav;
    favorites: Array<any>;
    isMobile: boolean = false;
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
