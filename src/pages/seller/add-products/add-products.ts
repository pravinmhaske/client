import { Component, OnInit, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Http } from "@angular/http";
import { ToastController, Nav, ModalController } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { SetGetUser, CategoriesService, SellerService, ProductsService } from '../../../providers/index';

interface ProductModel {
  name: string;
  brand: string;
  discount: string;
  price: string;
  discountedPrice: string;
  catname: string;
  subcatname: string;
  range: number;
  homeDeliveryCharge: any;
  otherspecifications: string;
  available_qty: string;
  category: {
    catname: string;
    subcatname: string;
  }
}

@Component({
  selector: 'add-products-template',
  templateUrl: 'add-products.html'
})
export class AddProductsPage implements OnInit {
  /* data variables start */
  @ViewChild(Nav) nav: Nav;
  @Input() outletsList: any;
  @Input() product: any;
  @Input() shopname: any;
  public myForm: FormGroup;
  public submitted: boolean;
  public events: any[] = [];
  public groupCategoryList: any;
  private categoryList: any;
  public specifications: any;
  public specificationsFiltered: any;
  public subCategoryList: any;
  public filters: any;
  selectedCategory: any;
  selectedSubCategory: any;
  public isHomeDeliveryAvailabe: Boolean;
  specificationlist: Array<any> = [];
  isProductImageUploaded: boolean = false;
  showStaticCat = false;

  categorySelected: boolean = false;
  subCataegorySelected: boolean = false;
  //  public toast: any;
  name: string;
  discountedPrice: any = 0;
  //cropper
  data1: any;
  cropperSettings1: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;

  //image upload below
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  /* data variables ends */
  /* data constructor oninit start */
  constructor(
    private _fb: FormBuilder,
    private http: Http,
    private compFactoryResolver: ComponentFactoryResolver,
    public productService: ProductsService,
    public modalCtrl: ModalController,
    public userGetterSetter: SetGetUser,
    public toastCtrl: ToastController,
    public sellerService: SellerService,
    private _categoryService: CategoriesService
  ) {
    this.name = 'Add products page';
  }
  ngOnInit() {
    this.groupCategoryList = this._categoryService.getCategoryData();
    
    console.log("this.categoryList =", this.groupCategoryList)
    this.extractCategoriesSubcategories(this.groupCategoryList);
    //crop
    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 300;
    this.cropperSettings1.height = 300;
    this.cropperSettings1.croppedWidth = 300;
    this.cropperSettings1.croppedHeight = 300;
    this.cropperSettings1.canvasWidth = 300;
    this.cropperSettings1.canvasHeight = 300;
    this.cropperSettings1.minWidth = 150;
    this.cropperSettings1.minHeight = 150;
    this.cropperSettings1.rounded = false;
    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.data1 = {};
    //
    if (this.product === undefined) {
      this.myForm = this._fb.group({
        name: ['', [<any>Validators.required, <any>Validators.minLength(3)]],
        price: ['', [<any>Validators.required, <any>Validators.minLength(1)]],
        brand: ['', []],
        available_qty: ['', []],
        discount: ['0', []],
        discountedPrice: ['0', []],
        //        prodImg: [this.file, [<any>Validators.required]],
        prodImg: [this.file, []],
        outletsCount: ['', []],
        range: ['5', []],
        homeDeliveryCharge: ['0', []],
        otherspecifications: ['', []],
        category: this._fb.group({
          catname: ['Select Category', <any>Validators.required],
          subcatname: ['Select Sub-Category', <any>Validators.required]
        })
      });
      if (this.outletsList.length === 1) {
        this.selectedItems = this.outletsList;
        //   this.selectedItems.push(this.outletsList[0]);
      } else { this.selectedItems = []; }
      this.isHomeDeliveryAvailabe = false;
    } else {
      this.getEditProdFilters();
      this.myForm = this._fb.group({
        name: [this.product.name, [<any>Validators.required, <any>Validators.minLength(3)]],
        price: [this.product.originalprice, [<any>Validators.required, <any>Validators.minLength(1)]],
        brand: [this.product.brandname, []],
        available_qty: ['', []],
        discount: [this.product.offer, []],
        outletsCount: ['', []],
        prodImg: [this.product.img, []],
        discountedPrice: ['0', []],
        range: [this.product.homedelibrangeeryrange, []],
        homeDeliveryCharge: [this.product.homedeliverycharge, []],
        otherspecifications: [this.product.otherspecifications, []],
        category: this._fb.group({
          catname: [this.product.category, <any>Validators.required],
          subcatname: [this.product.subcategory, <any>Validators.required]
        })
      });

      // let selectedProdOutletIds = this.product.outlet_ids.split(",");
      let selectedProdOutletIds = this.product.outlets.map(ele=>ele.id)
      
      // this.selectedItems=this.outletsList;
      this.selectedItems = [];
      for (let i = 0; i < this.outletsList.length; i++) {

        for (let j = 0; j < selectedProdOutletIds.length; j++) {
          if (this.outletsList[i].id === selectedProdOutletIds[j]) {
            this.selectedItems.push({
              "outletid": this.outletsList[i].id,
              "itemName": this.outletsList[i].itemName
            });
          }
        }
      }
      if (this.product.is_home_delivery) {
        this.isHomeDeliveryAvailabe = true;
      } else {
        this.isHomeDeliveryAvailabe = false;
      }
      this.categorySelected = true;
      this.subCataegorySelected = true;
      console.log("product =", this.product)
      $(".tabbable-panel li").removeClass("active");
      $(".tabbable-panel [href='#seller_tab_default_2']").parent().addClass("active");
      $(".tabbable-panel #seller_tab_default_1").removeClass("active");
      $(".tabbable-panel #seller_tab_default_2").addClass("active");


    }
    this.subcribeToFormChanges();
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Outlets/Branches *",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }
  /* data constructor oninit end here */
  extractCategoriesSubcategories(groupCategoryList) {
    this.categoryList = new Array();
    this.subCategoryList = new Array();
    this.groupCategoryList.forEach(group => {
      this.categoryList = this.categoryList.concat(group.categories);
    });
  }
  onCategoryChange(selectedCatId, event) {
    if (selectedCatId.trim() !== "Select Category") {
      this.categorySelected = true;
    } else
      this.categorySelected = false;
    for (let index = 0; index < this.categoryList.length; index++) {
      if (this.categoryList[index].catname.trim() === selectedCatId.trim()) {
        this.subCategoryList = this.categoryList[index].subcategories;
        break;
      }
    }
  }
  //subcategorychange
  onSubCategoryChange(selectedCatId) {

    if (selectedCatId.trim() !== "Select Sub-Category") {
      this.subCataegorySelected = true;
    } else
      this.subCataegorySelected = false;

    console.log("onSubCategoryChange ", selectedCatId);
    this.filters = new Array();
    this.subCategoryList.forEach(subcat => {

      if (selectedCatId.trim() === subcat.name) {
        this.filters = _.cloneDeep(subcat.specifications);
      }
    });
    console.log("Filter ", this.filters);;
  }

  //relted to ulpoad
  image: any = new Image();
  file: File;
  handleInputChange(event) {
    this.file = event.target.files[0];
    // prodImgFileControl.value=this.file;
    this.myForm.controls['prodImg'].setValue(this.file.name);
    var pattern = /image-*/;
    var reader = new FileReader();
    console.log("file :", this.file);
  }

  subcribeToFormChanges() {
    const myFormStatusChanges$ = this.myForm.statusChanges;
    const myFormValueChanges$ = this.myForm.valueChanges;

    myFormStatusChanges$.subscribe(x => this.events.push({
      event: 'STATUS_CHANGED',
      object: x
    }));
    myFormValueChanges$.subscribe(x => this.events.push({
      event: 'VALUE_CHANGED',
      object: x
    }));
  }

  saveProduct(model: ProductModel, isValid: boolean) {
    var loggedInuser = this.userGetterSetter.getLoginUser().loggedInUserDetails;
    console.log('in  submit click');
    this.submitted = true;
    let toast = this.toastCtrl.create({
      message: '', cssClass: 'mytoast', duration: 4000
    });
    if (isValid && this.selectedItems.length>0 && this.categorySelected && this.subCataegorySelected && loggedInuser.email !== "") {
      console.log('in valid submit click');
      var addProductRequestObj = new Object();
      if (this.product !== undefined) {
        addProductRequestObj["prodid"] = this.product._id;
      }
      addProductRequestObj["outletsArr"] = this.selectedItems;
      addProductRequestObj["name"] = model.name;
      addProductRequestObj["brand"] = model.brand?model.brand:"";
      addProductRequestObj["discount"] = model.discount?model.discount:"0";
      addProductRequestObj["originalprice"] = model.price;
      addProductRequestObj["finalprice"] = model.discountedPrice;
      addProductRequestObj["catname"] = model.category.catname;
      addProductRequestObj["subcatname"] = model.category.subcatname;
      //   addProductRequestObj["available_qty"] = model.available_qty;
      addProductRequestObj["is_homedeliveryavailable"] = this.isHomeDeliveryAvailabe;
      if (this.isHomeDeliveryAvailabe) {
        addProductRequestObj["range"] = model.range;
        addProductRequestObj["homedeliverycharge"] = model.homeDeliveryCharge;
      } else {
        addProductRequestObj["range"] = 0;
        addProductRequestObj["homedeliverycharge"] = 0;
      }
      addProductRequestObj["specifications"] = this.extractSelectedSpecificattions(this.filters);
      addProductRequestObj["shopName"] = this.shopname; //get shop name here
      addProductRequestObj["shopId"] = loggedInuser.shopId;
      addProductRequestObj["otherspecifications"] = model.otherspecifications;

      if (this.data1.image !== undefined) {
        addProductRequestObj["productimage"] = this.data1.image;
      }
      this.sellerService.addEditProduct(addProductRequestObj)
        .subscribe(response => {
          if (response.success) {
            if (response.productadded > 0) {
              toast.data.message = response.message;
              toast.present(toast);
              this._resetAddProductForm();
            } else if (response.productupdated) {
              toast.data.message = "Product has been updated successfully.";
              toast.present(toast);
              //              this.myForm.reset();
              //              this.data1.image = null;
              this.submitted = false;
              // this.nav.setRoot(ProductsPage);

            } else {
              toast.data.message = "There was problem while performing the operations.";
              toast.present(toast);
              // this.nav.setRoot(ProductsPage);
            }
          } else {
            toast.data.message = response.message;
            toast.present(toast);
          }
        }, err => this.handleError(err))

    } else if (loggedInuser.email === "") {
      toast.data.message = "Please login to continue.";
      toast.present(toast);
    } else {
      toast.data.message = "Please fill mandatory fields to continue.";
      toast.present(toast);
    }
  }
  _resetAddProductForm() {
    this.myForm.reset();
    this.filters=[];
    this.submitted = false;
    this.selectedItems = [];
    this.data1.image = "";
    
    // this.filters.map(ele=>{ //reset filter logic

    // });
  }
  extractSelectedSpecificattions(filters) {
    let specifications = _.cloneDeep(filters);
    // let specifications=(filters);
    for (var i = 0; i < specifications.length; i++) {
      let specification = specifications[i].value;
      const result = specification.filter(element => element.isselected == true);
      specifications[i].value = result
    }
    return specifications;
  }
  handleError(error) {
    let toast = this.toastCtrl.create({
      message: '', cssClass: 'mytoast', duration: 4000
    });
    toast.data.message = "Unexpected error occured Connecting to server.Please try again later.";
    toast.present(toast);
    console.log("in Error :", error)
  }

  onOfferBlur(type) {
    if (this.myForm.controls.price.value !== undefined || this.myForm.controls.price.value !== "") {
      if (type === 'percentage') {
        let discountedPrice = (this.myForm.controls.discount.value * this.myForm.controls.price.value) / 100;
        this.myForm.controls['discountedPrice'].setValue(this.myForm.controls.price.value - discountedPrice);
      } else if (type === 'originalprice') {
        let discountedPrice = (this.myForm.controls.discount.value * this.myForm.controls.price.value) / 100;
        this.myForm.controls['discountedPrice'].setValue(this.myForm.controls.price.value - discountedPrice);

      } else { //discounted price textbox blur

        let orginalPrice = (this.myForm.controls.discountedPrice.value * 100) / (100 - this.myForm.controls.discount.value);
        this.myForm.controls['price'].setValue(orginalPrice);

      }
    }

  }


  getIsHomeDeliveyAvailableInput(event) {
    // debugger;
    if ($(event.target).text() === 'NO') {
      console.log('No');
      $($(event.target).parent().children()[1]).removeClass('notActive');
      $($(event.target).parent().children()[1]).addClass('active');
      $($(event.target).parent().children()[0]).removeClass('active');
      $($(event.target).parent().children()[0]).addClass('notActive');
      this.isHomeDeliveryAvailabe = false;
    } else {
      console.log('Yes');
      $($(event.target).parent().children()[0]).removeClass('notActive');
      $($(event.target).parent().children()[0]).addClass('active');
      $($(event.target).parent().children()[1]).removeClass('active');
      $($(event.target).parent().children()[1]).addClass('notActive');
      this.isHomeDeliveryAvailabe = true;

    }
    console.log('is seller checkbox checked');
  }
  selectProductSpecification(specification, i, e) {
    var isRadioFilter = this.filters[i].type.toString().toLowerCase() === "radio";
    this.filters[i].value.forEach(spec => {
      if (specification.val === spec.val) {
        spec.isselected = !spec.isselected;
      } else if(isRadioFilter) {
        spec.isselected = false;
      }
    });
  }

  //image cropper
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
    console.log("in cropped");
    this.isProductImageUploaded = true;
    this.myForm.controls['prodImg'].setValue("imageuploaded");
  }

  fileChangeListener($event) {
    console.log("in fileChangeListener");
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    this.myForm.controls['prodImg'].setValue("imageuploaded");
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
      console.log("in onloadend");

    };

    myReader.readAsDataURL(file);
  }

  getEditProdFilters() {
    this.showStaticCat = true;
    var catFound = false;
    var productSpecs = [];
    this.groupCategoryList.forEach(group => {
      group.categories.forEach(cat => {
        if(!catFound && cat.catname == this.product.category) {
          cat.subcategories.find(subCat => {
            if(!catFound && subCat.name == this.product.subcategory) {
              productSpecs = subCat.specifications;
              catFound = true;
            }
          });
        }
      });
    });
    productSpecs.forEach(prodSpec => {
      this.product.specifications.find(currentProd => {
        if(currentProd.name === prodSpec.name) {
          prodSpec.value.forEach(specValue => {
            if(currentProd.value.find(o=>{return o.val == specValue.val;})) 
            specValue.isselected = true;
          });
        }
      });
    });
    this.filters = productSpecs;
  }
}
