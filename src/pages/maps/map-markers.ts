import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import {  MapsAPILoader } from '@agm/core';
import { LocationDetails } from '../../providers/location-details';
import {} from '@types/googlemaps';
import * as $ from 'jquery';

declare var google: any;
@Component({
  selector: 'map-markers',
  templateUrl: 'map-markers.html'
})
export class MapMarkers implements OnInit { 
    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number = 4;
    public outlet: any;
    public marker: any;
    public markers = [];
    @ViewChild("search")
    public searchElementRef: ElementRef;
    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private mapsDetailsService: LocationDetails
    ) {} 
    ngOnInit() {
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
        this.pickMyCurrentLocation(null, null);
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ['establishment']
        });
        autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
            });
            this.pickMyCurrentLocation(this.latitude, this.longitude);
        });
    });
  }
  
  pickMyCurrentLocation(latitude, longitude) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((data) => {
            this.latitude = latitude ? latitude : data.coords.latitude;
            this.longitude = longitude ? longitude : data.coords.longitude;
            var geocoder = new google.maps.Geocoder();
            var latlng = {lat:this.latitude, lng:this.longitude};
            this.outlet = {};
            this.zoom = 12;
            this.outlet.location = (this.latitude + "," + this.longitude);
            geocoder.geocode({
                'location': latlng
            }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        this.outlet.address = results[0].formatted_address;
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                                if (results[0].address_components[i].types[b] === "administrative_area_level_2") {
                                    this.outlet.city = results[0].address_components[i].long_name;
                                } else if(results[0]&&results[0].address_components[i].types[b]==="postal_code") {
                                    this.outlet.zip = results[0].address_components[i].long_name;
                                }
                            }
                        }
                        this.mapsDetailsService.setLocation(this.outlet);
                        this.setMarkers(this.latitude, this.longitude);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
    setMarkers(lat, long) {
        var outletObj = this.outlet;
        var locations = [this.outlet.address, lat, long, 1];
        var latlng = new google.maps.LatLng(lat, long);
        var mapPoint = new google.maps.Map(document.getElementById('userLocation'), {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            fullscreenControl: false
        });
        let infowindow = new google.maps.InfoWindow({
            content: this.outlet.address,
            positionMiddleOfWindow: true
        });
        var marker, i;
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: mapPoint
        });
        mapPoint.setCenter(marker.getPosition());
        this.markers.push(marker);
        mapPoint.addListener('click', event=> {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
            this.markers = [];
            marker = new google.maps.Marker({
                position: event.latLng,
                map: mapPoint
            });
            this.markers.push(marker);
            mapPoint.setCenter(marker.getPosition());
            google.maps.event.addListener(marker, "mouseup", e=> {
                var infoWindow = new google.maps.InfoWindow({
                    positionMiddleOfWindow: true,
                    content:'<input type="text" id="outletAddress" placeholder="Complete address"><br/>'+
                        '<input type="text" id="outletCity" placeholder="City"><br/>'+
                        '<input type="number" id="outletZip" placeholder="Zip/Pin code">'+
                        '<div id="saveOutlet" style="border:1px solid black;padding:2px;">Save</div>'
                });
                outletObj.location = e.latLng.lat()+','+e.latLng.lng();
                setTimeout(function() {
                    $("#saveOutlet").click(function() {
                        outletObj.address = document.getElementById('outletAddress')['value'];
                        outletObj.city = document.getElementById('outletCity')['value'];
                        outletObj.zip = document.getElementById('outletZip')['value'];
                    });
                }, 0);
                infoWindow.open(mapPoint, marker);
           });
        });
        // google.maps.event.addListener(marker, 'click', () => {
        //     let infowindow = new google.maps.InfoWindow({
        //         content: address,
        //         positionMiddleOfWindow: true
        //     });
        //     infowindow.open(mapPoint, marker);
        //     mapPoint.setCenter(marker.getPosition());
        // });
        google.maps.event.addListenerOnce(mapPoint, 'tilesloaded', () => {
            infowindow.open(mapPoint, marker);
        });
    }

    saveManualData() {
        this.outlet = document.getElementById('outletAddress');
        // document.getElementById('outletCity')
        // document.getElementById('outletZip')
    }
}