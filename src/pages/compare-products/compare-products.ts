import { Component } from '@angular/core';
import {  NavParams } from 'ionic-angular';
import * as _ from 'lodash';
@Component({
    selector: 'compare-products',
    templateUrl: 'compare-products.html'
})
export class CompareProductsPage {
    products: any = this.navParams.get('products');
    productsCompareList = {
        imgurl: [],
        name: [],
        price: [],
        ratings: [],
        brand: [],
        highlight: []
    }
    constructor(public navParams: NavParams) {
        this.formatProductsList();
    }

    formatProductsList() {
        _.each(this.products, product => {
            this.productsCompareList.imgurl.push(product.imgurl);
            this.productsCompareList.name.push(product.name);
            this.productsCompareList.price.push({
                finalprice: product.finalprice,
                originalprice: product.originalprice,
                offer: product.offer
            });
            this.productsCompareList.ratings.push(product.ratings);
            this.productsCompareList.highlight.push(product.specifications);
        });
        // this.products.forEach(product => {
        //     this.productsCompareList.imgurl.push(product.imgurl);
        //     this.productsCompareList.name.push(product.name);
        //     this.productsCompareList.price.push({
        //         finalprice: product.finalprice,
        //         originalprice: product.originalprice,
        //         offer: product.offer
        //     });
        //     this.productsCompareList.ratings.push(product.ratings);
        //     this.productsCompareList.highlight = product.specifications;
        // });
        // debugger
    }
    // formatProducts() {
    //     this.products.forEach(product => {
    //         if(product.rating) {
    //             product.star = Math.round(((product.rating.split(',').reduce(function(a, b) {
    //                 return Number(a) + Number(b);
    //             }, 0)) / product.rating.split(',').length));
    //         }
    //         product.specifications = [];
    //         if(product.specids) {
    //             specifications.filter(specObj => {
    //                 product.specids.split(',').filter(specId => {
    //                     if(product.specifications.length == 0 && specObj.specId == specId) {
    //                         product.specifications.push({name:specObj.spec, values:[specObj.value]});
    //                     } else if(product.specifications.length != 0 && specObj.specId == specId) {
    //                         var index;
    //                         if(product.specifications.find((obj, i) => {
    //                             if(obj.name == specObj.spec) {index = i;return true;}})
    //                             ) {
    //                             if(index>=0) product.specifications[index].values.push(specObj.value);
    //                         } else {
    //                             product.specifications.push({name:specObj.spec, values:[specObj.value]});
    //                         }
    //                     }
    //                 });
    //             });
    //         }
    //     });
    // }

    /*ngOnInit() {
        this.getProducts(this.navParams.data.list, this.navParams.data.specifications);
    }

    getProducts(list, specifications) {
        var products = [];
        list = '(' + list.join(',') + ')';
        this.productService.compareProducts(list).subscribe(response => {
            products = this.productsFilter.formatProducts(response, specifications);
            for(var key of Object.keys(products[0])) {
               if(key!=="updatedTime" && key!=="prodid" && key!=="specids"){
                var array = [key];
                products.forEach((product, index) => {
                      array.push(product[key]);
                });
                this.compareRows.push(array);

               }
               
            }
        });
    }*/

}
