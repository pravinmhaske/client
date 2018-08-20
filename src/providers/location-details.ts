import { Injectable} from '@angular/core';

@Injectable()
export class LocationDetails {
  location: any;
  constructor() {
  }
  getLocation() {
    return this.location;
  }
  setLocation(location: any) {
    this.location = location;
  }

}