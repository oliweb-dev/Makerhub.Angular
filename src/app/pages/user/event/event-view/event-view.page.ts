import {Component, ViewContainerRef} from '@angular/core';
import {EventModel} from 'src/app/models/eventModel.model';
import * as L from 'leaflet';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from 'src/app/services/event.service';
import {PopupMeetingComponent} from 'src/app/shared/popup-meeting/popup-meeting.component';
import { UserService } from 'src/app/services/user.service';

@Component({
   selector: 'app-event-view',
   templateUrl: './event-view.page.html',
   styleUrls: ['./event-view.page.scss'],
})
export class EventViewPage {
   eventModel: EventModel | undefined;
   map: L.Map;
   canModify: boolean = false;

   constructor(
      private readonly _eventService: EventService,
      private readonly _route: ActivatedRoute,
      private readonly _router: Router,
      private readonly _viewContainerRef: ViewContainerRef,
      private readonly _userService: UserService
   ) {}

   ionViewDidEnter() {
      const meetingId: string | null = this._route.snapshot.paramMap.get('id');
      if (meetingId) {
         this.eventModel = this._eventService.eventBehavior$.value.eventList.find(e => e.meetingId === +meetingId);
         this.canModify = this.eventModel.userId === this._userService.userId$.value;
         this.buildMap();
      }
   }

   buildMap() {
      this.map = L.map('mapIdEventView').setView([this.eventModel.latitude, this.eventModel.longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: 'edupala.com © Angular LeafLet',
      }).addTo(this.map);

      let markerIcon = L.icon({
         iconUrl: '../../../assets/img/location-pin-green-64.png',
         iconSize: [48, 48],
         iconAnchor: [35, 55],
         popupAnchor: [-3, -55],
      });

      const popup = this._viewContainerRef.createComponent(PopupMeetingComponent);
      popup.instance.eventModel = this.eventModel;

      L.marker([this.eventModel.latitude, this.eventModel.longitude], {icon: markerIcon})
         .addTo(this.map)
         .bindPopup(popup.location.nativeElement);
   }

   editEvent() {
      this._router.navigate(['user/event/edit', this.eventModel.meetingId]);
   }

   ionViewDidLeave() {
      this.map.remove();
   }
}
