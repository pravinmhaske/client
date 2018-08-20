import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, NavController, App, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FavoriteListPage } from '../pages/favorite-list/favorite-list';
import { AboutPage } from '../pages/about/about';
// import {LoginBackgroundSliderPage} from '../pages/login/login-background-slider';
import { ProductsPage } from '../pages/products/products-page';
import { SellerDetailsPage } from '../pages/seller/seller-details';
import { CachedSellerService } from '../providers/cached-seller';
import { SetGetUser } from '../providers/set-loggedin-user.service';

export interface MenuItem {
    title: string;
    // component: any;
    icon: string;
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp implements OnInit {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = ProductsPage;
    appMenuItems: Array<any>;
    accountMenuItems: Array<MenuItem>;
    helpMenuItems: Array<MenuItem>;
    public isUserLoggedIn = false;
    public isSeller = false;
    private toast = this.toastCtrl.create({
        message: '',
        cssClass: 'mytoast',
        duration: 2000
    });
    constructor(public toastCtrl: ToastController,
        private app: App,
        public events: Events,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public sellerCache: CachedSellerService,
        public setGetUser: SetGetUser) {
        this.initializeApp();
        events.subscribe('user:userdetails', (loggedInUserDetails) => {
            console.log('subscribing event here');
            this.isUserLoggedIn = loggedInUserDetails.isAuthenticatedUser;
            this.isSeller = loggedInUserDetails.loggedInUserDetails.isSeller;
        });
        this.appMenuItems = [
            { title: 'All Products', component: ProductsPage, icon: 'apps' },
            { title: 'Wish list', component: FavoriteListPage, icon: 'heart' },
            { title: 'My Profile', component: SellerDetailsPage, icon: 'contact' },
            { title: 'My Products', component: ProductsPage, icon: 'logo-buffer' },
            { title: 'Login', icon: 'contact' },
            { title: 'Logout', icon: 'log-out' },
            { title: 'About Selomart', component: AboutPage, icon: 'list-box' },
        ];
    }
    ngOnInit() {
        let LoggedInUser = this.setGetUser.getLoginUser();
        if (LoggedInUser) {
            console.log("in on init", LoggedInUser.isAuthenticatedUser);
            this.isUserLoggedIn = LoggedInUser.isAuthenticatedUser;
            this.isSeller = LoggedInUser.loggedInUserDetails.isSeller;
        }
    }
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
        });
    }
    openPage(page, event) {
        if (page.title === "Logout") {
            this.toast.data.message = "Write service here to log user out.Curremtyly dummy.";
            this.toast.present(this.toast);
            let LoggedInUser = {
                isAuthenticatedUser: false,
                loggedInUserDetails: {
                    isSeller: false,
                    email: "",
                    shopId: "",
                    registrationid: ""
                }
            };
            this.setGetUser.setLoginUser(LoggedInUser);
            this.isUserLoggedIn = false;
            // this.nav.setRoot(ProductsPage);
            this.app.getRootNav().setRoot(ProductsPage);
        } else if (page.title === "Login") {
            // this.events.publish('user:loginClicked',event);
            this.events.publish('user:loginClicked', event);
        } else if (page.title === "My Products") {
            let seller = this.setGetUser.getLoginUser();
            this.sellerCache.setShopInfo(seller.loggedInUserDetails.shopId);
            if (seller.loggedInUserDetails.isSeller) {
                this.sellerCache.setShopInfo(seller.loggedInUserDetails.isSeller);
                this.app.getRootNav().setRoot(ProductsPage);
                // this.app.getActiveNav().setRoot(ProductsPage);
            }
        } else {
            // this.nav.setRoot(page.component);
            this.app.getRootNav().setRoot(page.component);
        }
    }

}
