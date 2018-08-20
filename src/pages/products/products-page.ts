import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, App, ToastController, Nav, AlertController, Events, Content, LoadingController } from 'ionic-angular';
import { CachedSellerService,SetGetUser,CategoriesService,ProductsService } from '../../providers/index';
import { ProductDetailsPage } from '../product-detail/product-details';
import { CompareProductsPage } from '../compare-products/compare-products'
import { CategoryModalPage } from '../category-modal/category-modal';
import { FilterModalPage } from '../filter-modal/filter-modal';
import { Observable } from 'rxjs/Observable';
import { SellerDetailsPage } from '../seller/seller-details';
import { FavoriteListPage } from '../favorite-list/favorite-list';
import { AboutPage } from '../about/about';
import * as _ from 'lodash';

@Component({
  selector: 'products-page',
  templateUrl: 'products-page.html'
})
export class ProductsPage implements OnInit {
  /* data variables start */
  @ViewChild(Content) content: Content;
  @ViewChild(Nav) nav: Nav;

  products: any;
  selectedSubcategory:any;
  productsBckup: any;
  allProducts: any;
  scrolling: boolean = false;
  groups: any;
  specifications: any;
  filterApplied: boolean = false;
  public static categoryDetails: any;
  categories: any;
  showDialog = false;
  filteredSpec: any = [];
  filterOptions: any = [];
  filterOptionsBckup: any;
  showSubcategories: any;
  loggedInUser: any;
  productType: any = {};
  compareList: any = [];
  showFilter = false;
  isMobile: boolean = false;
  loggedInUserDetails = {
    isSeller: false,
    email: "",
    shopId: "",
    registrationid: ""
  };
  paginationModelTotCount: number = 0;
  pageNumber: number = 1;
  
  isUserLoggedIn: Boolean = false;
  isSeller: Boolean = false;
  // events:Events;
  appMenuItems: Array<any>;
  /* data variables ends */
  /* data constructor oninit start */
  constructor(
    private _app: App,
    public loadingCtrl: LoadingController,
    public userGetterSetter: SetGetUser,
    private _categoryService:CategoriesService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public productService: ProductsService,
    public cachedSellerDetails: CachedSellerService,
    public modalCtrl: ModalController,
    public events: Events,
    public toastCtrl: ToastController
  ) {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    events.subscribe('user:loginClicked', (data) => {
      this.userLogin(data);
    });
    events.subscribe('user:userdetails', (loggedInUserDetails) => {
      console.log('subscribing event here ', loggedInUserDetails);
      this.loggedInUserDetails = loggedInUserDetails.loggedInUserDetails;
      this.isUserLoggedIn = loggedInUserDetails.isAuthenticatedUser;
      this.isSeller = loggedInUserDetails.loggedInUserDetails.isSeller;
    });
    //initialze menus
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
    this.getProducts();
    this.getCategoriesData();
    //    this.productService.getSpecifications().subscribe(response => {
    //      if (response) this.specifications = response;
    //    });
    let LoggedInUser = this.userGetterSetter.getLoginUser();
    if (LoggedInUser) {
      console.log("in on init", LoggedInUser.isAuthenticatedUser);
      this.isUserLoggedIn = LoggedInUser.isAuthenticatedUser;
      this.isSeller = LoggedInUser.loggedInUserDetails.isSeller;
      this.loggedInUserDetails = LoggedInUser['loggedInUserDetails'];
    }
    //     this.onPaginationItemClicked(1);
  }
  /* data constructor oninit ends */
  onPaginationItemClicked(pageNumber) {
    console.log("pageNumber " + pageNumber);
    this.pageNumber = pageNumber;
    //    event.stopPropagation();
    this.getProducts();

  }
  onMenuBarClick() {
    let loggedInUserDetails = this.userGetterSetter.getLoginUser();
    this.events.publish('user:userdetails', loggedInUserDetails);
  }
  getCategoriesData() {
    let responseData: any;
    let toast = this.toastCtrl.create({
      message: '', cssClass: 'mytoast', duration: 2000
    });
    this.productService.getCategories().subscribe((response) => {
      if (response.success) {
        console.log(" cat =" + response.categoryList);
        this.categories = response.categoryList;
        this._categoryService.setCategoryData( this.categories);
      } else {
        toast.data.message = "There was some problem while connectiong to server.Please try again.";
        toast.present(toast);
      }

      //      if (response) {
      //        ProductsPage.categoryDetails = response;
      //        responseData = response;
      //        let filtr = []
      //        responseData.filter(categoryItem => {
      //          if (filtr.length == 0) {
      //            filtr.push({
      //              groupId: categoryItem.groupId,
      //              groupName: categoryItem.groupName,
      //              groupCategories: [{
      //                catId: categoryItem.catId,
      //                catName: categoryItem.catName,
      //                subCat: [categoryItem.subCat]
      //              }]
      //            });
      //          } else {
      //            filtr.filter(filtrItem => {
      //              if (filtrItem.groupId == categoryItem.groupId) {
      //                filtrItem.groupCategories.push({catId: categoryItem.catId, catName: categoryItem.catName, subCat: [categoryItem.subCat]});
      //              } else {
      //                if (!_.find(filtr, i => {return i.groupId == categoryItem.groupId})) {
      //                  filtr.push({
      //                    groupId: categoryItem.groupId,
      //                    groupName: categoryItem.groupName,
      //                    groupCategories: [{
      //                      catId: categoryItem.catId,
      //                      catName: categoryItem.catName,
      //                      subCat: [categoryItem.subCat]
      //                    }]
      //                  });
      //                }
      //              }
      //            });
      //          }
      //        });
      //        this.categories = filtr;
      //        console.log(" this.categories :"+ this.categories);
      //      }
    }, err => this.handleError(err))
  }
  getProducts() {
    console.log("in get products");
    let userDetails = this.userGetterSetter.getLoginUser();
    if (userDetails && userDetails.loggedInUserDetails.isSeller && this.cachedSellerDetails.getShopInfo()) {
      this.productService.getAllProducts(userDetails.loggedInUserDetails.shopId, this.pageNumber).subscribe((response) => {
        // if(response && response.productsList && response.productsList.length>0) {
        //   this.products = response.productsList;
        //   this.allProducts = JSON.parse(JSON.stringify(response.productsList));
        //   this.filterOptionsBckup = undefined;
        //   this.productsBckup = undefined;
        // }
        if (response.success && response.productsList.length > 0) {
          this.products = response.productsList;
          this.allProducts = JSON.parse(JSON.stringify(response.productsList));
          this.filterOptionsBckup = undefined;
          this.productsBckup = undefined;;
          this.filterApplied = false;
          this.paginationModelTotCount = response.totalItems;

        } else if (response.productsList.length === 0) {
          console.log("Sorry No Products available");

        } else if (!response.success) {
          console.log("Something went wrong");

        }
      });
    } else {
      this.productService.getAllProducts('-', this.pageNumber).subscribe((response) => {
        if (response.success && response.productsList.length > 0) {
          this.products = response.productsList;
          this.allProducts = JSON.parse(JSON.stringify(response.productsList));
          this.filterOptionsBckup = undefined;
          this.productsBckup = undefined;
          this.filterApplied = false;
          this.paginationModelTotCount = response.totalItems;
        } else if (response.productsList && response.productsList.length === 0) {
          console.log("Sorry No Products available");

        } else if (!response.success) {
          console.log("Something went wrong");

        }
        // if(response && response.productsList && response.productsList.length>0) {
        //   this.products = response.productsList;
        //   this.allProducts = JSON.parse(JSON.stringify(response.productsList));
        //   this.filterOptionsBckup = undefined;
        //   this.productsBckup = undefined;
        // }
      });
    }
  }

  userLogin(event) {
    event.preventDefault();
    this.modalCtrl.create("SignupModalPage", null, { cssClass: 'inset-modal' }).present();
    event.stopPropagation();
  }
  openProductDetails(productObj) {
    this.navCtrl.push(ProductDetailsPage,{productid:productObj._id});

    // let prodDetails: any = this.productService.getProdDetails(
    //   { prodid: productObj.prodid, outlet_ids: productObj.outlet_ids }
    // ).subscribe((response) => {
    //   let product = response;
    //   this.navCtrl.push(ProductDetailsPage, { product, specifications: this.specifications });
    // });
  }
  getAllProducts() {
    this.products = this.allProducts;
    this.filterApplied = false;
    this.filterOptions = [];
  }
  getProductAvgRate(rating: string) {
    if (rating) {
      return Math.round(((rating.split(',').reduce(function (a, b) {
        return Number(a) + Number(b);
      }, 0)) / rating.split(',').length) * 10) / 10;
    } else return 0;
  }
  getRatingCount(rating: string) {
    if(rating && rating!="0" ) {
      return (eval(rating.split(',').join('+')) / rating.split(',').length).toFixed(1);
    }
    return 0;
  }

  selectCatGroup(selectedGroup) {
    let modal = this.modalCtrl.create(CategoryModalPage, {
      'categorisedData': selectedGroup.categories, 
      'groupname': selectedGroup.groupname
    });
    modal.onDidDismiss(data => {
      if(data && data.catname && !data.subcat) {
        this.productType.catName = data.catname;
        this.onCategorySelected(data); 
      } else if(data && data.catname && data.subcat) {
        this.productType.catName = data.catname;
        this.selectSubcategories(data.subcat);
      }
    });
    modal.present();
  }
  /*
  selectCategory(selectedCtgryId: number) {
    this.products.forEach(product => {
      product.specifications = [];
      if (product.specids) {
        this.specifications.filter(specObj => {
          product.specids.split(',').filter(specId => {
            if (product.specifications && product.specifications.length == 0 && specObj.specId == specId) {
              product.specifications.push({ name: specObj.spec, values: [specObj.value] });
            } else if (product.specifications.length != 0 && specObj.specId == specId) {
              var index;
              if (product.specifications.find((obj, i) => {
                if (obj.name == specObj.spec) { index = i; return true; }
              })
              ) {
                if (index >= 0) product.specifications[index].values.push(specObj.value);
              } else {
                product.specifications.push({ name: specObj.spec, values: [specObj.value] });
              }
            }
          });
        });
      }
    });
    let categorisedData: any;
    if (ProductsPage.categoryDetails) {
      categorisedData = ProductsPage.categoryDetails.filter(cat => {
        return cat.groupId == selectedCtgryId;
      });
    }
    let modal = this.modalCtrl.create(CategoryModalPage, { 'categorisedData': categorisedData });
    modal.onDidDismiss(data => {
      this.onCategorySelected(data);
    });
    modal.present();
  }*/

  selectSubcategories(selectedSubcat: any) {
    this.filterApplied = true;
    this.productType.subcatName = selectedSubcat.name;
    this.filterOptions = selectedSubcat.specifications;
    this.getFilteredProducts({
      category: this.productType.catName,
      subcategory: this.productType.subcatName
    });
    //  this.productsBckup = this.productsBckup || JSON.parse(JSON.stringify(this.products));

    // this.specifications.filter(specObj => {
    //   this.productsBckup.filter(product => {
    //     product.specArray = product.specArray || [];
    //     if (product.specids) product.specids.split(',').filter(specId => {
    //       if (specObj.specId == specId) {
    //         if ((product.specArray.length == 0) ||
    //           (product.specArray.length > 0 && !product.specArray.find(i => { return i.specname == specObj.spec; }))) {
    //           product.specArray.push({ specname: specObj.spec, specId: specObj.specId, type: specObj.type, values: [specObj.value] });
    //         } else {
    //           product.specArray.filter(i => {
    //             if (i.specname == specObj.spec) i.values.push(specObj.value);
    //           });
    //         }
    //       }
    //     });
    //   });
    // });
    // this.products = this.productsBckup.filter(product => {
    //   return product.subcatId == selectedSubcat.subcatId;
    // });
    // this.filterOptionsBckup = this.filterOptionsBckup || JSON.parse(JSON.stringify(this.filterOptions));
    // this.filterOptions = JSON.parse(JSON.stringify(this.filterOptionsBckup));
    // this.filterOptions.filter(filterOption => {
    //   filterOption.options = filterOption.options.filter(obj => {
    //     return obj.subcatId == selectedSubcat.subcatId
    //   });
    // });
  }

  clearFilters() {
    this.filterOptions.forEach(fo => {
      fo.value.forEach(obj => {obj.isselected = false;});
    });
    _.each(document.getElementsByClassName('filter-item-checkbox'), elm => {
      elm.style.backgroundColor = "lightgray";
      elm.closest('.cat-filter-options').style.border = '';
    });
    _.each(document.getElementsByClassName('filter-item-color'), elm => {
      elm.closest('.cat-filter-options').style.border = '';
    });
    this.getFilteredProducts({
      category: this.productType.catName,
      subcategory: this.productType.subcatName
    });

    
    /*this.showFilter = true;
    if (this.productsBckup) {
      this.products = this.productsBckup.filter(product => {
        return product.catId == this.productType.catId && product.subcatId == this.productType.subcatId;
      });
    }
    if (this.filterOptions && this.filterOptions.length > 0) {
      this.filterOptions.forEach(filterOption => {
        if (filterOption.options.length > 0) {
          filterOption.options.forEach(option => {
            if (option.subcatValues && option.subcatValues.length > 0) {
              option.subcatValues.forEach(subcatValue => {
                subcatValue.isSelected = false;
              });
            }
          });
        }
      });
    }*/
  }

  onCategorySelected(data: any) {
    if (!data || data != 'clear' && data.catname) {
      this.filterApplied = true;
      this.showSubcategories = data.subcategories;
      this.productType.catName = data.catname;
      this.productType.subcatName = this.showSubcategories[0].name;
      this.filterOptions = this.showSubcategories[0].specifications;
      this.getFilteredProducts({
        category: this.productType.catName,
        subcategory: this.productType.subcatName
      });
      //      if (this.productType && data) this.productType.catId = data.catId;
    }
    //    if (data && data.catId && !data.subcatId) {
    //      if (data.subCat) this.showSubcategories = data.subCat[0];
    //      if (this.products)
    //        this.products = this.products.filter(product => {return product.catId == data.catId;});
    //      var filteredSpecs = this.specifications.filter(item => {
    //        return item.catId == data.catId;
    //      });
    //      filteredSpecs.filter(item => {
    //        if (this.filterOptions.length == 0) {
    //          this.filterOptions.push({catId: item.catId, specname: item.spec, unit: item.unit, type: item.type});
    //          this.filterOptions[0].values = [];
    //          this.filterOptions[0].values.push({
    //            key: item.value, subcatId: item.subcatId,
    //            subcatName: item.subcatName, id: item.specId, isSelected: false
    //          });
    //        } else {
    //          if (!this.filterOptions.find(i => {return item.spec == i.specname;})) {
    //            this.filterOptions.push({
    //              catId: item.catId, specname: item.spec, unit: item.unit, type: item.type,
    //              values: [{key: item.value, subcatId: item.subcatId, subcatName: item.subcatName, id: item.specId, isSelected: false}]
    //            });
    //          } else {
    //            this.filterOptions.filter(arrObj => {
    //              if (arrObj.catId == item.catId && arrObj.specname == item.spec) {
    //                arrObj.values.push({key: item.value, subcatId: item.subcatId, subcatName: item.subcatName, id: item.specId, isSelected: false});
    //              }
    //            });
    //          }
    //        }
    //      });
    //      this.filterOptions.filter(filterObj => {
    //        filterObj.options = [];
    //        filterObj.values.filter((value, index) => {
    //          if (filterObj.options.length == 0) {
    //            filterObj.options.push({
    //              subcatId: value.subcatId, subcatName: value.subcatName,
    //              subcatValues: [{key: value.key, id: value.id, isSelected: value.isSelected}]
    //            });
    //          } else {
    //            if (!filterObj.options.find(i => {return i.subcatId == value.subcatId;})) {
    //              filterObj.options.push({
    //                subcatId: value.subcatId, subcatName: value.subcatName,
    //                subcatValues: [{key: value.key, id: value.id, isSelected: value.isSelected}]
    //              });
    //            } else {
    //              filterObj.options.filter(i => {
    //                if (i.subcatId == value.subcatId) i.subcatValues.push({key: value.key, id: value.id, isSelected: value.isSelected});
    //              });
    //            }
    //          }
    //        });
    //      });
    //      this.filterOptions.forEach(i => {delete i['values']});
    //    }
    // if (data && data.catId && data.subcatId) {
    //   this.filterApplied = true;
    //   this.furnishFilterOptions(data);
    // }
    // else if (data == 'clear') {
    //   this.products = this.allProducts;
    // }
  }

  furnishFilterOptions(data) {
    this.showFilter = true;
    this.productType.subcatId = data.subcatId;
    this.productsBckup = this.productsBckup || JSON.parse(JSON.stringify(this.products));
    this.products = this.productsBckup.filter(p => { return p.subcatId == data.subcatId; });
    var filters = [];
    this.specifications.forEach(specObj => {
      if (specObj.catId == data.catId && specObj.subcatId == data.subcatId) {
        if (filters.length > 0) {
          if (!filters.find(option => option.spec == specObj.spec)) {
            filters.push(JSON.parse(JSON.stringify(specObj)));
            let i = filters.length - 1;
            filters[i].values = [filters[i].value];
            delete filters[i].value;
          } else {
            _.find(filters, option => {
              if (option.spec == specObj.spec) option.values.push(specObj.value);
            });
          }
        } else {
          filters.push(JSON.parse(JSON.stringify(specObj)));
          filters[0].values = [filters[0].value];
          delete filters[0].value;
        }
      }
    });
    this.filterOptionsBckup = this.filterOptionsBckup || filters;
    this.filterOptions = JSON.parse(JSON.stringify(this.filterOptionsBckup));
  }

  onModalFilters(selectedFilters) {
    if(selectedFilters.length) {
      let data = {
        category: this.productType.catName,
        subcategory: this.productType.subcatName,
        selectedFilters: selectedFilters
      };
      this.getFilteredProducts(data);
    }
    /*if (data) {
      var newProducts = [];
      this.products.forEach(product => {
        var matchingSpec = 0;
        product.specifications.forEach(specObj => {
          data.forEach(filterOption => {
            if (filterOption.spec == specObj.name) {
              if (_.intersection(specObj.values, filterOption.values.length)) matchingSpec++;
            }
          });
        });
        if (product.specifications.length == matchingSpec) newProducts.push(product);
      });
      this.products = newProducts;
    }*/
  }

  addFiltersModal() {
    let filterModal = this.modalCtrl.create(FilterModalPage, { 'filters': this.filterOptions });
    filterModal.onDidDismiss(data => {
      if(data) {
        this.onModalFilters(data);
      }
    });
    filterModal.present();
  }

  editProduct(product: any) {
    this.navCtrl.push(SellerDetailsPage, { product: product, calledFrom: 'editProduct' });
  }

  showSellerDetails(shopid: string) {
    console.log("shopid ", shopid);
    // this.userGetterSetter.setLoginUser(LoggedInUser);
    this.navCtrl.push(SellerDetailsPage, { shopId: shopid, calledFrom: 'productspage' });
  }
  addToCompare(product, event) {
    if(this.compareList.length < 4) {
      this.compareList.push(product);
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'You can compare only 4 products',
        duration: 2000
      });
      toast.present(toast);
      event.target.checked = false;
    }

    /*if (event.target.checked && this.compareList.length < 4) this.compareList.push(prodId);
    else if (event.target.checked && this.compareList.length >= 4) {
      event.target.checked = false;
      let toast = this.toastCtrl.create({
        message: 'You can compare only 4 products',
        duration: 2000
      });
      toast.present(toast);
    }
    else this.compareList = this.compareList.filter(i => { return i != prodId; });*/
  }

  compareProducts() {
    if (this.compareList.length == 1) {
      let toast = this.toastCtrl.create({
        message: 'Select multiple products to compare',
        duration: 2000
      });
      toast.present(toast);
    } else {
      this.navCtrl.push(CompareProductsPage, {'products': this.compareList});
    }
  }

  addProductFilters(event: any) {
    if(event.target.className == "filter-item-checkbox" || 
      event.target.parentElement.className == "filter-item-checkbox") {
      event.target.closest('.filter-item-checkbox').style.backgroundColor = 
      event.target.closest('.filter-item-checkbox').style.backgroundColor=='rgb(152, 151, 151)'?'':'#989797';
    }
    event.target.closest('.cat-filter-options').style.border = 
      !event.target.closest('.cat-filter-options').style.border ? "1px solid" : "";
    /*
    if (event.target.checked) {
      if (this.filterCache.length == 0 || !_.find(this.filterCache, i => { return i.specname == specname }))
        this.filterCache.push({ specname: specname, values: [key] });
      else {
        this.filterCache.filter(fcache => {
          if (fcache.specname == specname) fcache.values.push(key);
        });
      }
    } else {
      this.filterCache.filter((fObj, index) => {
        if (fObj.specname == specname && fObj.values.indexOf(key) >= 0) {//fObj.values = fObj.values.filter(i=>{return i!=key;});
          fObj.values.splice(fObj.values.indexOf(key), 1);
          if (fObj.values.length == 0)
            this.filterCache.splice(index, 1);
        }
      });
    }
    let newProducts = [];
    this.productsBckup.filter(product => {
      if (product.subcatId == subcatId) {
        let nonMatching = false;
        let foundSpec = false;
        product.specArray.filter(specObj => {
          if (this.filterCache && this.filterCache.length > 0) {
            this.filterCache.filter(filterObj => {
              if (specObj.specname == filterObj.specname) {
                foundSpec = true;
                let matching = _.intersection(specObj.values, filterObj.values);
                if (matching.length == 0) nonMatching = true;
              }
            });
          } else foundSpec = true;
        });
        if (!nonMatching && foundSpec) newProducts.push(product);
      }
    });
    this.products = newProducts;
    */
  }

  //desjktop menubar click
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
      this.events.publish('user:loginClicked',event);
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

  sortAlert() {
    var products = this.products;
    let prompt = this.alertCtrl.create({
      title: 'Sort Products',
      inputs: [
        { type: 'radio', label: 'Newest first', value: 'new' },
        { type: 'radio', label: 'Price: low to high', value: 'lowHigh' },
        { type: 'radio', label: 'Price: high to low', value: 'highLow' }
      ],
      buttons: [{
        text: "Cancel",
        handler: data => {
          console.log("cancel clicked");
        }
      }, {
        //
        text: "Sort",
        handler: data => {
          if (data == 'lowHigh') {
            _.sortBy(products, 'finalprice');
          } else if (data == 'highLow') {
            _.sortBy(products, 'finalprice').reverse();
          } else if (data == 'new') {
            console.log('Newest sorting todo')
          }
        }
      }]
    });
    prompt.present();
  }
  sortBy(sorter) {
    if (sorter == 'popular') {
      this.products = _.sortBy(this.products, 'rating');
    } else if (sorter == 'low2high') {
      this.products = _.sortBy(this.products, 'finalprice');
    } else if (sorter == 'high2low') {
      this.products = _.sortBy(this.products, 'finalprice').reverse();
    } else if (sorter == 'offer') {
      this.products.forEach(i => { i.offer = Number(i.offer) || 0 })
      this.products = _.sortBy(this.products, 'offer').reverse();
    } else if (sorter == 'newest') {
      this.products = _.sortBy(this.products, 'updatedat');
    }
  }
  public handleError(error: Response) {
    let toast = this.toastCtrl.create({
      message: '', cssClass: 'mytoast', duration: 2000
    });
    toast.data.message = "There was some problem while connecting to server.Please try again.";
    toast.present(toast);
    console.error(error);
    return Observable.throw('Server error');
    //    return Observable.throw(error.json().err || 'Server error');
  }

  // new filters logic -start here

  applyFilter() {
    let appliedFilters = _.cloneDeep(this.filterOptions, true);
    let selectedFilters = [];
    appliedFilters.forEach(fopn => {
      let selectedValues = [];
      selectedValues = fopn.value.filter(elm => elm.isselected == true);
      if(selectedValues.length) {
        fopn.value = selectedValues;
        selectedFilters.push(fopn);
      }
    });
    if(selectedFilters.length) {
      let data = {
        category: this.productType.catName,
        subcategory: this.productType.subcatName,
        selectedFilters: selectedFilters
      };
      this.getFilteredProducts(data);
    }
  }

  getFilteredProducts(data) {
    this.productService.getFilteredProducts(data).subscribe(response => {
      this.products = response.productsList;
      this.paginationModelTotCount = response.totalItems;
    });
  }

  // new filters logic -end here
  likeProductClick(product){
    let toast = this.toastCtrl.create({
      message: '', cssClass: 'mytoast', duration: 2000
    });
   
    let userDetails = this.userGetterSetter.getLoginUser();
    console.log("userDetails =",userDetails);
    if(userDetails.isAuthenticatedUser){
       this.likeProduct(product._id);
      console.log("like product =",product);
    } else {
      this.userLogin(event);
      toast.data.message = "Please login to like this product.";
      toast.present(toast);
    }
  }
  likeProduct(productid){
    let toast = this.toastCtrl.create({
      message: '', cssClass: 'mytoast', duration: 2000
    });
    this.productService.likeProduct(productid)
    .subscribe((response) => {
      if (response.success) {
        console.log("Product Liked");
        toast.data.message = response.message;
        this.getProducts();
        
      }  else {
        toast.data.message =response.message;
        console.log("Something went wrong");
 }
      toast.present(toast);
      // if(response && response.productsList && response.productsList.length>0) {
      //   this.products = response.productsList;
      //   this.allProducts = JSON.parse(JSON.stringify(response.productsList));
      //   this.filterOptionsBckup = undefined;
      //   this.productsBckup = undefined;
      // }
    });
  }
  rateProduct(){
    let toast = this.toastCtrl.create({
      message: '', cssClass: 'mytoast', duration: 2000
    });
    toast.data.message = "Rating feature will be introduced soon.Sorry for inconvenience caused.";
    toast.present(toast);
  }

}
