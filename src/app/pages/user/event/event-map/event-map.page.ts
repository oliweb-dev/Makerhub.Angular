import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {EventModel} from 'src/app/models/eventModel.model';
import * as L from 'leaflet';
import {environment} from 'src/environments/environment';
import {EventService} from 'src/app/services/event.service';
import {PopupComponent} from 'src/app/shared/popup/popup.component';
import {PopupMeetingComponent} from 'src/app/shared/popup-meeting/popup-meeting.component';

@Component({
   selector: 'app-event-map',
   templateUrl: './event-map.page.html',
})
export class EventMapPage {
   eventModelList: EventModel[] = [];
   map: L.Map;
   apiUrl: string = environment.apiUrl;

   constructor(
      private readonly _eventService: EventService,
      private readonly _viewContainerRef: ViewContainerRef
   ) {}

   ionViewDidEnter(): void {
      this.buildMap();
      this.getList();
   }

   getList(): void {
      this.eventModelList = this._eventService.eventBehavior$.value.eventList;
      this.setMarker();
   }

   buildMap() {
      this.map = L.map('mapIdEventMap').setView([50.85034, 4.35171], 8);

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

      for (let event of this.eventModelList) {
         const popup = this._viewContainerRef.createComponent(PopupMeetingComponent);
         popup.instance.eventModel = event;
         L.marker([event.latitude, event.longitude], {icon: markerIcon})
            .addTo(this.map)
            .bindPopup(popup.location.nativeElement);
      }
   }

   ionViewWillLeave() {
      this.map.remove();
   }
}
