import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
  selector: 'page-filter-modal',
  templateUrl: 'filter-modal.html',
})
export class FilterModalPage {	
  filterOptions: any = [];

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    this.filterOptions = this.navParams.get('filters');
  }

  addProductFilters(event: any) {
    if(event.target.className == "filter-item-checkbox" || 
      event.target.parentElement.className == "filter-item-checkbox") {
      event.target.closest('.filter-item-checkbox').style.backgroundColor = 
        event.target.closest('.filter-item-checkbox').style.backgroundColor=='rgb(152, 151, 151)'?'':'#989797';
    }
    event.target.closest('.cat-filter-options').style.border = 
      !event.target.closest('.cat-filter-options').style.border ? "1px solid" : "";
  }

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
    this.viewCtrl.dismiss(selectedFilters);
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
  }

  closeFilterModal() {
    this.viewCtrl.dismiss();
  }

  /*
  addToFilter(spec, value, event) {
    var filterArray = this.filterObj;
    if(event.target.checked) {
      filterArray.forEach(obj => {
        if(filterArray.find(i => {return i.spec == spec;}) && obj.spec == spec) {
          obj.values.push(value);
        } else if(!filterArray.find(i => {return i.spec == spec;})) {
          filterArray.push({spec: spec, values: [value]});
        }
      });
      this.filterObj = filterArray;
      if(!this.filterObj.length) this.filterObj.push({spec: spec, values: [value]}); 
    } else {
      filterArray.forEach(obj => {
        if(obj.spec == spec) {
          obj.values = obj.values.filter(j => {return j != value;});
        }
      });
    }
  }

  closeFilter(clear) {
    if(clear) this.viewCtrl.dismiss();
    else this.viewCtrl.dismiss(this.filterObj);
  }

  clearFilters() {
    $('#filterForm')[0].reset();
    this.filterObj = [];
  }*/
}
