import {Component, ViewChild, ElementRef,OnInit} from '@angular/core';
import {AlertController, NavController, Events, NavParams, Nav, App} from 'ionic-angular';
import { ProductsService } from '../../providers/products-service';
import { Geolocation } from '@ionic-native/geolocation';
import { SellerDetailsPage } from '../seller/seller-details';
import { SetGetUser } from '../../providers/set-loggedin-user.service';
import {FavoriteListPage} from '../favorite-list/favorite-list';
import {AboutPage} from '../about/about';
import {ProductsPage} from '../products/products-page';
import { CachedSellerService } from '../../providers/cached-seller';
declare var google;

@Component({
    selector: 'product-details',
    templateUrl: 'product-details.html'
})
export class ProductDetailsPage implements OnInit {
     /* data variables start */
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('mySlider') mySlider: any;
    @ViewChild(Nav) nav: Nav;
    _options: any;
    isMobile:boolean = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    appMenuItems:Array<any> = [
        {title: 'All Products', component: ProductsPage, icon: 'apps'},
        {title: 'Wish list', component: FavoriteListPage, icon: 'heart'},
        {title: 'My Profile', component: SellerDetailsPage, icon: 'contact'},
        {title: 'My Products', component: ProductsPage, icon: 'logo-buffer'},
        {title: 'Login', icon: 'contact'},
        {title: 'Logout', icon: 'log-out'},
        {title: 'About Selomart', component: AboutPage, icon: 'list-box'},
    ];
    map: any;
    product: any;
    specifications: any;
    tab: number;
    productid:string;
    user: any = {userId: 1};
    showMap: boolean = false;
    similarProducts: any;
     //image upload below
     dropdownSettings = {};
     /* data variables ends */
     /* data constructor oninit start */
    constructor(
            public alertCtrl: AlertController,
            public navCtrl: NavController,
            public navParams: NavParams,
            public productService: ProductsService,
            public geolocation: Geolocation,
            public userGetterSetter: SetGetUser,
            public cachedSellerDetails: CachedSellerService,
            public events:Events,
            private _app:App
        ) {
            this.productid=this.navParams.data.productid;

        //this.specifications  = this.navParams.data.specifications;
        //this.product         = this.getProductDetails(this.navParams.data.product);

        this._options = {
            slidesPerView:3,
            pager: true,
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
            onInit:()=>{}
        }

        this.dropdownSettings = {
            singleSelection: false,
            text: "Select Outlets/Branches *",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class",
            disabled:true
        };
    }
    ngOnInit() {
        this.getProductDetails(this.productid);
    }
    /* data constructor oninit ends */
    getProductDetails(productid: any) {
        this.productService.getProdDetails(productid).subscribe(response => {
            this.product = response.productsData[0];
            console.log(this.product);
            // let prodid = this.product.prodid;
            // this.productService.findSimilar({catId: this.navParams.data.product.catId, subCatId: this.navParams.data.product.subcatId})
            //     .subscribe(response => {
            //         this.similarProducts = response.filter(i=>{return i.prodid!=prodid;});
            //     });
        });
        // if(product) {
        //     if(product.rating) {
        //         product.star = Math.round(((product.rating.split(',').reduce(function(a, b) {
        //             return Number(a) + Number(b);
        //         }, 0)) / product.rating.split(',').length));
        //     }
        //     this.tab = 0;
        //     product.specifications = [];
        //     if(product.specids) {
        //     this.specifications.filter(specObj => {
        //         product.specids.split(',').filter(specId => {
        //             if(product.specifications.length == 0 && specObj.specId == specId) {
        //                 product.specifications.push({name:specObj.spec, values:[specObj.value]});
        //             } else if(product.specifications.length != 0 && specObj.specId == specId) {
        //                 var index;
        //                 if(product.specifications.find((obj, i) => {
        //                     if(obj.name == specObj.spec) {index = i;return true;}})
        //                     ) {
        //                     if(index>=0) product.specifications[index].values.push(specObj.value);
        //                 } else {
        //                     product.specifications.push({name:specObj.spec, values:[specObj.value]});
        //                 }
        //             }
        //         });
        //     });
        //     }
        //     return product;
        // }
        // this.loadMap();
    }
    getProductAvgRate(rating: string) {
        if(rating) {
          return Math.round(((rating.split(',').reduce(function(a, b) {
              return Number(a) + Number(b);
          }, 0)) / rating.split(',').length) * 10) / 10;
        } else return 0;
    }
    getRatingCount(rating: string) {
        if(rating) {
            return (eval(rating.split(',').join('+')) / rating.split(',').length).toFixed(1);
        }
        return 0;
    }
    userAction(actionPerformed: string) {
        this.productService.userAction(this.product.productid, this.user.userId, actionPerformed).subscribe((response) => {
            if (response.status == 200) {
                if(actionPerformed == 'addToFav') {
                    this.user = response.json();
                    this.user.favourite = this.user.favourite.split(',').length;
                } else if(actionPerformed == 'likeProduct') {
                    this.product = response.json();
                }
            }
        });
    }

    onModelChange(rating: string) {
        let ratingData: any = {productId: this.product.productid, userId: this.user.userId, star: rating, actionType: 'rating'};
        this.productService.rateProduct(ratingData).subscribe((response) => {
            if(response.status == 200) this.product = response.json();
        });
    }

    loadMap() {
        let latitude = this.product.shopLocation.split(',')[0];
        let longitude = this.product.shopLocation.split(',')[1];
        this.geolocation.getCurrentPosition().then((position) => {
            let latLng = new google.maps.LatLng(latitude, longitude);
            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: this.map.getCenter()
            });
            let content = this.product.shopName;
            this.addInfoWindow(marker, content);
            }, (err) => {
          console.log(err);
        });
    }

    addInfoWindow(marker, content){
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });
    }

    openLocation() {
        const alert = this.alertCtrl.create({
          title: 'Shop Location',
          buttons: ['Ok']
        });
        alert.present();
    }

    launchDialer(n:string) {

            // debugger;
            console.log("dial launcher");

        /*window.open("tel:" + n);
        this.callNumber.callNumber(n, true)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));*/
    }
    getUniqueOutletZip(outletsData: any) {
        let outlets: any = [];
        outletsData.filter(outlet => {
            if(outlets.length === 0) outlets.push(outlet.zip);
            else {
                if(!outlets.find(item => {if(outlet.zip == item) return true;})) {
                    outlets.push(outlet.zip);
                }
            }
        });
        return outlets;
    }

    showSellerDetails(shopid: string) {
        this.navCtrl.push(SellerDetailsPage,{ shopId: shopid});
    }

    openProductDetails(productObj) {
        let prodDetails:any = this.productService.getProdDetails(
        {prodid: productObj.productid, outlet_ids: productObj.outlet_ids}
        ).subscribe((response) => {
            let product = response;
            this.navCtrl.push(ProductDetailsPage, {product, specifications: this.specifications});
        });
    }
    openPage(page,event) {
        if(page.title==="Logout") {
            let LoggedInUser = {
                isAuthenticatedUser:false,
                loggedInUserDetails:{
                    isSeller: false,
                    email: "",
                    shopId: "",
                    registrationid:""
                }
            };
            this.nav.setRoot(ProductsPage);
        }  else if(page.title==="Login") {
            this.events.publish('user:loginClicked');
            event.stopPropagation();
        } else if(page.title==="My Products") {
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
