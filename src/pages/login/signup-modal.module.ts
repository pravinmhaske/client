import { SignupModalPage } from './signup-modal';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MapMarkersPageModule} from '../maps/map-markers.module';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    SignupModalPage
  ],
  imports: [
   IonicPageModule.forChild(SignupModalPage),
   MapMarkersPageModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCwGlG6B4cTvLrer3UITUBVM7cSxk8bYQ4",
      libraries: ["places"],
      language: 'en',
      region: 'IN'
    })
  ],
  exports: [
   SignupModalPage
  ]
})

export class SignupModalPageModule { }
