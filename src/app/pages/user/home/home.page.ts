import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Activity } from 'src/app/models/activity.model';
import { EventModel } from 'src/app/models/eventModel.model';
import { UserHome } from 'src/app/models/userHome.model';
import { ActivityService } from 'src/app/services/activity.service';
import { EventService } from 'src/app/services/event.service';
import { HomeService } from 'src/app/services/home.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-home',
   templateUrl: './home.page.html',
   styleUrls: ['./home.page.scss'],
})
export class HomePage {
   userHome: UserHome = null;
  //  activitiesList: Activity[] = [];
  //  eventModelList: EventModel[] = [];
  //  totalActivity: number;
   apiUrl: string = environment.apiUrl;
   private destroyed$: Subject<boolean> = new Subject<boolean>();

   constructor(
      private readonly _userService: UserService,
      private readonly _homeService: HomeService,
      private readonly _activityService: ActivityService,
      private readonly _eventService: EventService,
      private readonly _toastService: ToastService,
      private readonly _actionSheetCtrl: ActionSheetController,
      private readonly _router: Router
   ) {}

   ionViewDidEnter(): void {
      this.getData();
   }

   getData(): void {
      this._homeService.userHome$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
         this.userHome = response;
         //console.log(this.userHome);
      });
      // this._activityService.activityList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
      //    this.totalActivity = response.length;
      //    this.activitiesList = response.slice(0, 3);
      // });
      // this._eventService.eventList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
      //    let listEvent = response.filter(e => e.isRegistered === true);
      //    listEvent = listEvent.slice(0, 3);
      //    this.eventModelList = listEvent;
      // });
   }

   handleRefresh(event) {
      setTimeout(() => {
        //  this._activityService.loadData();
        //  this._eventService.loadData();
         this._homeService.loadDataHomePage();
         event.target.complete();
      }, 2000);
   }

   /* Activity --- */

   async presentActionSheetActivity(activity: Activity) {
      const actionSheet = await this._actionSheetCtrl.create({
         header: 'Actions',
         buttons: [
            {
               text: "Détail de l'action",
               role: 'display',
               icon: 'eye-outline',
               handler: () => this.goToActivity(activity.activityId),
            },
            {
               text: activity.isLiked ? "Je n'aime plus cette action" : "J'aime cette action",
               role: 'like',
               icon: activity.isLiked ? 'heart-dislike-outline' : 'heart-outline',
               handler: activity.isLiked
                  ? () => this.dislike(activity.activityId)
                  : () => this.like(activity.activityId),
            },
            {
               text: 'Annuler',
               role: 'close',
               icon: 'arrow-back-outline',
            },
         ],
      });
      actionSheet.present();
   }

   goToActivity(activityId: number) {
      this._router.navigate(['user/activity/view', activityId]);
   }

   like(activityId: number) {
      this._activityService.like({ activityId: activityId }).subscribe({
         next: _ => {
            this._toastService.display("J'aime cette action", 'heart-outline');
            //this.getData();
            this._router.navigate(['user/home/']);
         },
      });
   }

   dislike(activityId: number) {
      this._activityService.dislike({ activityId: activityId }).subscribe({
         next: _ => {
            this._toastService.display("Je n'aime plus cette action", 'heart-dislike-outline');
            this._router.navigate(['user/home/']);
         },
      });
   }

   /* Meeting --- */

   async presentActionSheetEvent(eventModel: EventModel) {
      const actionSheet = await this._actionSheetCtrl.create({
         header: 'Actions',
         buttons: [
            {
               text: "Détail de l'événement",
               role: 'display',
               icon: 'eye-outline',
               handler: () => this.goToEvent(eventModel.meetingId),
            },
            {
               text: eventModel.isRegistered
                  ? 'Me désinscrire de cet événement'
                  : "M'inscrire à cet événement",
               role: 'subscribe',
               icon: eventModel.isRegistered ? 'person-remove-outline' : 'person-add-outline',
               handler: eventModel.isRegistered
                  ? () => this.unsubscribeToEvent(eventModel.meetingId)
                  : () => this.subscribeToEvent(eventModel.meetingId),
            },
            {
               text: eventModel.isLiked ? "Je n'aime plus cet événement" : "J'aime cet événement",
               role: 'like',
               icon: eventModel.isLiked ? 'heart-dislike-outline' : 'heart-outline',
               handler: eventModel.isLiked
                  ? () => this.dislikeEvent(eventModel.meetingId)
                  : () => this.likeEvent(eventModel.meetingId),
            },
            {
               text: 'Annuler',
               role: 'cancel',
               icon: 'close-outline',
            },
         ],
      });
      actionSheet.present();
   }

   goToEvent(eventId: number) {
      this._router.navigate(['user/event/view', eventId]);
   }

   subscribeToEvent(meetingId: number) {
      this._eventService.eventSubscribe({ meetingId: meetingId }).subscribe({
         next: _ => {
            this._toastService.display('Vous êtes inscrits à cet événement', 'person-add-outline');
            this._router.navigate(['user/home/']);
         },
      });
   }

   unsubscribeToEvent(meetingId: number) {
      this._eventService.eventUnsubscribe({ meetingId: meetingId }).subscribe({
         next: _ => {
            this._toastService.display('vous êtes désinscrit de cet événement', 'person-remove-outline');
            this._router.navigate(['user/home/']);
         },
      });
   }

   likeEvent(meetingId: number) {
      this._eventService.like({ meetingId: meetingId }).subscribe({
         next: _ => {
            this._toastService.display("J'aime cet événement", 'heart-outline');
            this._router.navigate(['user/home/']);
         },
      });
   }

   dislikeEvent(meetingId: number) {
      this._eventService.dislike({ meetingId: meetingId }).subscribe({
         next: _ => {
            this._toastService.display("Je n'aime plus cet événement", 'heart-dislike-outline');
            this._router.navigate(['user/home/']);
         },
      });
   }

   ionViewWillLeave() {
      this.destroyed$.next(true);
   }
}
