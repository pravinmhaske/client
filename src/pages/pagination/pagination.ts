
import {Component, Input,Output} from '@angular/core';
import {PagerService} from '../../providers/pager.service';
import { EventEmitter } from "@angular/core";
//import {Http, Response} from '@angular/http';
@Component({
  selector: 'pagination',
  templateUrl: 'pagination.html'
})
export class PaginationPage {
  /* data variables start */
//  @Input() productItems: any[];
  @Input() totalItems: number;
  pager: any = {};  // pager object
//  pagedItems: any[];// paged items
   @Output() onPaginationItemClicked: EventEmitter<any> = new EventEmitter();
  /* data variables ends */
  /* data constructor oninit start */
  constructor( private pagerService: PagerService) {}
  ngOnInit() {
//    this.setPage(1);
    this.pager = this.pagerService.getPager(this.totalItems, 1);
//    this.pagedItems=this.productItems;
  }

  /* data constructor oninit ends */

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
//    console.log("this.allItems " + this.productItems);// get pager object from service
    this.pager = this.pagerService.getPager(this.totalItems, page);
//    this.pagedItems=this.productItems;
     this.onPaginationItemClicked.emit(page);
    
    // get current page of items
//    this.pagedItems = this.productItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}

