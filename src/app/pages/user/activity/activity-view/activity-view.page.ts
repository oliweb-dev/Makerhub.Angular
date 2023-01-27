import { Component, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from 'src/app/models/activity.model';
import * as L from 'leaflet';
import { ActivityService } from 'src/app/services/activity.service';
import { environment } from 'src/environments/environment';
import { PopupComponent } from 'src/app/shared/popup/popup.component';
import { UserService } from 'src/app/services/user.service';

@Component({
   selector: 'app-activity-view',
   templateUrl: './activity-view.page.html',
   styleUrls: ['./activity-view.page.scss'],
})
export class ActivityViewPage {
   activity: Activity | undefined;
   map: L.Map;
   apiUrl: string = environment.apiUrl;
   canModify: boolean = false;

   constructor(
      private readonly _activityService: ActivityService,
      private readonly _route: ActivatedRoute,
      private readonly _router: Router,
      private readonly _viewContainerRef: ViewContainerRef,
      private readonly _userService: UserService
   ) {}

   ionViewDidEnter() {
      const activityId: string | null = this._route.snapshot.paramMap.get('id');
      if (activityId) {
         this.activity = this._activityService.activityBehavior$.value.activityList.find(a => a.activityId === +activityId);
         this.canModify = this.activity.userId === this._userService.userId$.value;
         this.buildMap();
      }
   }

   buildMap() {
      this.map = L.map('mapIdActivityView').setView([this.activity.latitude, this.activity.longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: 'edupala.com © Angular LeafLet',
      }).addTo(this.map);

      let markerIcon = L.icon({
         iconUrl: '../../../assets/img/location-pin-green-64.png',
         iconSize: [48, 48],
         iconAnchor: [35, 55],
         popupAnchor: [-3, -55],
      });

      const popup = this._viewContainerRef.createComponent(PopupComponent);
      popup.instance.activity = this.activity;

      L.marker([this.activity.latitude, this.activity.longitude], { icon: markerIcon })
         .addTo(this.map)
         .bindPopup(popup.location.nativeElement);
   }

   editActivity() {
      this._router.navigate(['user/activity/edit', this.activity.activityId]);
   }

   ionViewDidLeave() {
      this.map.remove();
   }
}
