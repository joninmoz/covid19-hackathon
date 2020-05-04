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
    this.loadMap({'longitude': 10.573803999999999, 'latitude': 7.4053223,
    'TestingAvailability': true, 'BedAvailability': false, 'VentilatorAvailability': false});
  }
  loadMap(params){
    console.log("loadMap called");
    let long = params['longitude']
    let lat = params['latitude']
    let testing = params['TestingAvailability']
    let bed = params['BedAvailability']
    let ventilator = params['VentilatorAvailability']
    console.log(testing, typeof testing)
    let latLng = new google.maps.LatLng(this.lat, this.lng);
    this.http.get("assets/data/hotosm_nga_health_facilities_points.json").subscribe(val => {
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
          console.log(lat)
          var search_url = 'https://www.google.com/maps/dir/?api=1&destination=' + val[Object.keys(val)[i]]['latitude'].toString() + "," + val[Object.keys(val)[i]]['longitude'].toString() + '&origin=' + lat.toString() + "," + long.toString() + '&language=pt'
          console.log(search_url)
          infowindow.setContent(val[Object.keys(val)[i]]['Name'] + '<a href=' + search_url + '><button>Go!</button></a>');
          infowindow.open(map, marker);
        }
      })(marker, i));

    }
    map.fitBounds(bounds); //auto-zoom
    this.map = map
    });

  }
}
