import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ActionSheetController} from '@ionic/angular';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Activity} from 'src/app/models/activity.model';
import {ActivityService} from 'src/app/services/activity.service';
import {ToastService} from 'src/app/services/toast.service';
import {UserService} from 'src/app/services/user.service';

@Component({
   selector: 'app-activity',
   templateUrl: './activity.page.html',
   styleUrls: ['./activity.page.scss'],
})
export class ActivityPage {
   activitiesList: Activity[] = [];
   currentUserId: number;
   private destroyed$: Subject<boolean> = new Subject<boolean>();
   
   private _displayPublic: boolean;
   get displayPublic() {
      return this._displayPublic;
   }
   set displayPublic(value: boolean) {
      this._displayPublic = value;
      this._activityService.toogleDisplayPublicActivity(value);
   }

   constructor(
      private readonly _activityService: ActivityService,
      private readonly _actionSheetCtrl: ActionSheetController,
      private readonly _router: Router,
      private readonly _toastService: ToastService,
      private readonly _userService: UserService
   ) {}

   ionViewDidEnter(): void {
      this.getList();
      this.currentUserId = this._userService.userId$.value;
   }

   handleRefresh(event) {
      setTimeout(() => {
         this._activityService.loadData();
         event.target.complete();
      }, 2000);
   }

   getList(): void {
      this._activityService.activityBehavior$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
         this.activitiesList = response.activityList;
         this._displayPublic = response.filter.displayPublicActivity;
      });
   }

   async presentActionSheet(activity: Activity) {
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
      this._activityService.like({activityId: activityId}).subscribe({
         next: _ => {
            this._toastService.display("J'aime cette action", 'heart-outline');
            this._router.navigate(['user/activity/']);
         },
      });
   }

   dislike(activityId: number) {
      this._activityService.dislike({activityId: activityId}).subscribe({
         next: _ => {
            this._toastService.display("Je n'aime plus cette action", 'heart-dislike-outline');
            this._router.navigate(['user/activity/']);
         },
      });
   }

   ionViewWillLeave() {
      this.destroyed$.next(true);
   }
}
