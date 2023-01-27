import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import * as L from 'leaflet';
import {BehaviorSubject} from 'rxjs';
import {Coordonnees} from 'src/app/models/coordonnees.model';

@Component({
   selector: 'app-modal-map',
   templateUrl: './modal-map.component.html',
})
export class ModalMapComponent {
   map: L.Map;
   @Input() mySubject: BehaviorSubject<Coordonnees>;

   constructor(private readonly modalCtrl: ModalController) {}

   ionViewDidEnter(): void {
      console.log(this.mySubject.value.latitude);
      console.log(this.mySubject.value.longitude);
      this.buildMap();
   }

   cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
   }

   confirm() {
      return this.modalCtrl.dismiss(null, 'confirm');
   }

   buildMap() {
      this.map = L.map('mapId').setView([this.mySubject.value.latitude, this.mySubject.value.longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: 'edupala.com © Angular LeafLet',
      }).addTo(this.map);

      let markerIcon = L.icon({
         iconUrl: '../../../assets/img/location-pin-green-64.png',
         iconSize: [48, 48],
         iconAnchor: [35, 55],
         popupAnchor: [-3, -55],
      });

      let marker = L.marker([this.mySubject.value.latitude, this.mySubject.value.longitude], {
         icon: markerIcon,
      }).addTo(this.map);

      this.map.on('click', e => {
         const {lat, lng} = e.latlng;
         this.mySubject.next({latitude: lat, longitude: lng});
         marker && this.map.removeLayer(marker);
         marker = new L.Marker([lat, lng], {icon: markerIcon}).addTo(this.map);
      });
   }

   ionViewWillLeave() {
      this.map.remove();
   }
}
