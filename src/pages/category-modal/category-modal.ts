import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
  selector: 'page-category-modal',
  templateUrl: 'category-modal.html',
})
export class CategoryModalPage implements OnInit{
  categorisedData: any = JSON.parse(JSON.stringify(this.navParams.get('categorisedData')));
  groupname = this.navParams.get('groupname');
  allCatData: any = _.cloneDeep(this.categorisedData);
  openCat: String;
  
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {}

  ngOnInit() {
    this.openCat = this.categorisedData[0].catname;
  }
  
  selectCat(category) {
    this.viewCtrl.dismiss(category);
  }

  selectSubCat(catname, subcat) {
    this.viewCtrl.dismiss({catname: catname, subcat: subcat});
  }

  clearFilter() {
    this.categorisedData = JSON.parse(this.allCatData);
    this.viewCtrl.dismiss('clear');
  }

  goBack() {
    this.viewCtrl.dismiss();    
  }
  // closeModal(data: any, isSpecificCat: boolean) {
  //   if(isSpecificCat)
  //     this.viewCtrl.dismiss({catId: data});
  //   else
  //     if (data == '') this.viewCtrl.dismiss();
  //     else
  //       this.viewCtrl.dismiss(data);
  // }
}
