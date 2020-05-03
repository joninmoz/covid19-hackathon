import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.loadMap();
  }
  loadMap(){
    console.log("loadMap called");
    let latLng = new google.maps.LatLng(this.lat, this.lng);
    this.http.get(`http://localhost:8008/?longitude=8.4053223&latitude=10.573803999999999&TestingAvailability=False&BedAvailability=False&VentilatorAvailability=False`).subscribe(val => {
      let mapOptions = {
      zoom: 11,
      center: latLng,
      mapTypeId: 'terrain',
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] }
      ]
    }
    var map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var marker, i;
    var markers = new Array();
    for (i = 0; i < Object.keys(val).length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(val[Object.keys(val)[i]]['latitude'], val[Object.keys(val)[i]]['longitude']),
        map: map,
        title: val[Object.keys(val)[i]]['Name']
      });
      bounds.extend(marker.getPosition());
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(val[Object.keys(val)[i]]['Name']);
          infowindow.open(map, marker);
        }
      })(marker, i));

    }
    map.fitBounds(bounds); //auto-zoom
    this.map = map
    });

  }
}
