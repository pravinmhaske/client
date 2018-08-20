import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryModalPage } from './category-modal';

@NgModule({
  declarations: [
    CategoryModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryModalPage),
  ],
})
export class CategoryModalPageModule {}
