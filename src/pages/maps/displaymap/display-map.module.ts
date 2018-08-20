import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { displayMap } from './display-map';

@NgModule({
  declarations: [
    displayMap,
  ],
  imports: [
    IonicPageModule.forChild(displayMap),
  ],
  exports:[displayMap]
})
export class DisplayMapPageModule {}
