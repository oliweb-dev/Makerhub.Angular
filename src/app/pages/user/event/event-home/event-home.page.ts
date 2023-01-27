import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ActionSheetController} from '@ionic/angular';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {EventModel} from 'src/app/models/eventModel.model';
import {EventService} from 'src/app/services/event.service';
import {ToastService} from 'src/app/services/toast.service';
import {environment} from 'src/environments/environment';

@Component({
   selector: 'app-event-home',
   templateUrl: './event-home.page.html',
   styleUrls: ['./event-home.page.scss'],
})
export class EventHomePage {
   eventModelList: EventModel[] = [];
   private destroyed$: Subject<boolean> = new Subject<boolean>();
   //displayPastEvent: boolean;

   private _displayPastEvent: boolean;
   get displayPastEvent() {
      return this._displayPastEvent;
   }
   set displayPastEvent(value: boolean) {
      this._displayPastEvent = value;
      this._eventService.toogleDisplayPastEvent(value);
   }

   constructor(
      private readonly _eventService: EventService,
      private readonly _actionSheetCtrl: ActionSheetController,
      private readonly _router: Router,
      private readonly _toastService: ToastService
   ) {}

   ionViewDidEnter(): void {
      this.getList();
   }

   handleRefresh(event) {
      setTimeout(() => {
         this._eventService.loadData();
         event.target.complete();
      }, 2000);
   }

   getList(): void {
      this._eventService.eventBehavior$.pipe(takeUntil(this.destroyed$)).subscribe(({eventList, filter}) => {
         this.eventModelList = eventList;
         this._displayPastEvent = filter.displayPastEvent;
      });
   }

   async presentActionSheet(eventModel: EventModel) {
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
                  ? () => this.dislike(eventModel.meetingId)
                  : () => this.like(eventModel.meetingId),
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
      this._eventService.eventSubscribe({meetingId: meetingId}).subscribe({
         next: _ => {
            this._toastService.display('Vous êtes inscrits à cet événement', 'person-add-outline');
            this._router.navigate(['user/event/']);
         },
      });
   }

   unsubscribeToEvent(meetingId: number) {
      this._eventService.eventUnsubscribe({meetingId: meetingId}).subscribe({
         next: _ => {
            this._toastService.display('vous êtes désinscrit de cet événement', 'person-remove-outline');
            this._router.navigate(['user/event/']);
         },
      });
   }

   like(meetingId: number) {
      this._eventService.like({meetingId: meetingId}).subscribe({
         next: _ => {
            this._toastService.display("J'aime cet événement", 'heart-outline');
            this._router.navigate(['user/event/']);
         },
      });
   }

   dislike(meetingId: number) {
      this._eventService.dislike({meetingId: meetingId}).subscribe({
         next: _ => {
            this._toastService.display("Je n'aime plus cet événement", 'heart-dislike-outline');
            this._router.navigate(['user/event/']);
         },
      });
   }

   ionViewWillLeave() {
      this.destroyed$.next(true);
   }
}
