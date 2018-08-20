import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapMarkers } from './map-markers';

@NgModule({
  declarations: [
    MapMarkers,
  ],
  imports: [
    IonicPageModule.forChild(MapMarkers),
  ],
  exports:[MapMarkers]
})
export class MapMarkersPageModule {}
