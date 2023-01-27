import {Component, ViewContainerRef} from '@angular/core';
import {Activity} from 'src/app/models/activity.model';
import {ActivityService} from 'src/app/services/activity.service';
import {environment} from 'src/environments/environment';
import * as L from 'leaflet';
import {PopupComponent} from 'src/app/shared/popup/popup.component';

@Component({
   selector: 'app-activity-map',
   templateUrl: './activity-map.page.html',
})
export class ActivityMapPage {
   activitiesList: Activity[] = [];
   map: L.Map;
   apiUrl: string = environment.apiUrl;

   constructor(
      private readonly _activityService: ActivityService,
      private readonly _viewContainerRef: ViewContainerRef
   ) {}

   ionViewDidEnter(): void {
      this.buildMap();
      this.getList();
   }

   getList(): void {
      this.activitiesList = this._activityService.activityBehavior$.value.activityList;
      this.setMarker();
   }

   buildMap() {
      this.map = L.map('mapIdActivityMap').setView([50.85034, 4.35171], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: 'edupala.com © Angular LeafLet',
      }).addTo(this.map);
   }

   setMarker() {
      const markerIcon = L.icon({
         iconUrl: '../../../assets/img/location-pin-green-64.png',
         iconSize: [48, 48],
         iconAnchor: [35, 55],
         popupAnchor: [-3, -55],
      });

      for (let activity of this.activitiesList) {
         const popup = this._viewContainerRef.createComponent(PopupComponent);
         popup.instance.activity = activity;
         L.marker([activity.latitude, activity.longitude], {icon: markerIcon})
            .addTo(this.map)
            .bindPopup(popup.location.nativeElement);
      }
   }

   ionViewWillLeave() {
      this.map.remove();
   }
}
