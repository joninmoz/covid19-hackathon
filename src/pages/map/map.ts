import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  lat = 6.6010898;
  lng = 3.9391127;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
  }
  loadMap(){
    console.log("loadMap called");
    let latLng = new google.maps.LatLng(this.lat, this.lng);

    let mapOptions = {
      zoom: 11,
      center: latLng,
      mapTypeId: 'terrain',
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] }
      ]
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
}
