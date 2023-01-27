import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {Coordonnees} from 'src/app/models/coordonnees.model';
import {EventModel} from 'src/app/models/eventModel.model';
import {EventService} from 'src/app/services/event.service';
import {environment} from 'src/environments/environment';
import {ModalMapComponent} from '../../activity/modal-map/modal-map.component';
import {Guid} from 'guid-typescript';
import {finalize} from 'rxjs/operators';
import {EventModelEdit} from 'src/app/models/eventModelEdit.model';
import {ModalImageCroppingComponent} from '../../option/modal-image-cropping/modal-image-cropping.component';
import {ToastService} from 'src/app/services/toast.service';
import {UserService} from 'src/app/services/user.service';

@Component({
   selector: 'app-event-edit',
   templateUrl: './event-edit.page.html',
})
export class EventEditPage {
   eventModel: EventModel | undefined;
   fg!: FormGroup;
   showPicker: boolean = false;
   latitude: number;
   longitude: number;
   photo: string | null = null;
   isPhotoModified: boolean = false;
   apiUrl: string = environment.apiUrl;
   canDelete: boolean = false;

   constructor(
      private readonly _eventService: EventService,
      private readonly _formBuilder: FormBuilder,
      private readonly _route: ActivatedRoute,
      private readonly _router: Router,
      private readonly _http: HttpClient,
      private readonly _modalCtrl: ModalController,
      private readonly _toastService: ToastService,
      private readonly _alertController: AlertController,
      private readonly _userService: UserService
   ) {}

   ionViewDidEnter() {
      const meetingId: string | null = this._route.snapshot.paramMap.get('id');
      if (meetingId) {
         this.eventModel = this._eventService.eventBehavior$.value.eventList.find(
            e => e.meetingId === +meetingId
         );
         this.latitude = this.eventModel.latitude;
         this.longitude = this.eventModel.longitude;
         this.canDelete = this.eventModel.userId === this._userService.userId$.value;
         this.initForm();
      }
   }

   /* Form --- */

   initForm(): void {
      this.fg = this._formBuilder.group(
         {
            title: [
               this.eventModel.title,
               [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
            ],
            description: [this.eventModel.description],
            minParticipant: [
               this.eventModel.minParticipant,
               [Validators.required, Validators.min(1), Validators.max(200), Validators.pattern('^[0-9]+$')],
            ],
            maxParticipant: [
               this.eventModel.maxParticipant,
               [Validators.required, Validators.min(1), Validators.max(200), Validators.pattern('^[0-9]+$')],
            ],
         },
         {validators: [(fg: any) => this.MinInfMax(fg)]}
      );
   }

   get title() {
      return this.fg.get('title');
   }

   get minParticipant() {
      return this.fg.get('minParticipant');
   }

   get maxParticipant() {
      return this.fg.get('maxParticipant');
   }

   MinInfMax(fg: FormGroup): ValidationErrors | null {
      const min: AbstractControl = fg.get('minParticipant');
      const max: AbstractControl = fg.get('maxParticipant');
      if (!min.value || !max.value || min.value <= max.value) {
         min.setErrors(!min.errors || min.errors.minMax ? null : {...min.errors});
         max.setErrors(!max.errors || max.errors.minMax ? null : {...max.errors});
         return null;
      }
      min.setErrors({...min.errors, minMax: true});
      max.setErrors({...max.errors, minMax: true});
      return {minMax: true};
   }

   dateChanged(value: any): void {
      this.eventModel.date = value;
      this.showPicker = false;
   }

   /* Map --- */

   async openModal() {
      console.log('openModal()');
      const mySubject = new BehaviorSubject<Coordonnees>({
         latitude: this.latitude,
         longitude: this.longitude,
      });

      const modal = await this._modalCtrl.create({
         component: ModalMapComponent,
         componentProps: {
            mySubject,
         },
      });
      modal.present();

      const {role} = await modal.onWillDismiss();

      mySubject.subscribe((value: Coordonnees) => {
         if (role === 'confirm') {
            this.latitude = value.latitude;
            this.longitude = value.longitude;
         }
      });

      modal.onDidDismiss().then(_ => {
         mySubject.unsubscribe();
      });
   }

   /* Photo --- */

   async openModalPhoto() {
      const mySubject = new BehaviorSubject<string>('');

      const modal = await this._modalCtrl.create({
         component: ModalImageCroppingComponent,
         componentProps: {
            mySubject,
         },
      });
      modal.present();

      const {role} = await modal.onWillDismiss();

      mySubject.subscribe((value: string) => {
         if (role === 'confirm') {
            this.isPhotoModified = true;
            this.photo = value;
         }
      });

      modal.onDidDismiss().then(_ => {
         mySubject.unsubscribe();
      });
   }

   public removePhoto() {
      this.photo = null;
      this.eventModel.image = null;
      this.isPhotoModified = true;
   }

   async onSubmit() {
      if (this.fg.invalid) {
         return;
      }
      const eventModelEdit: EventModelEdit = this.fg.value;
      eventModelEdit.meetingId = this.eventModel.meetingId;
      eventModelEdit.date = this.eventModel.date;
      eventModelEdit.image = this.eventModel.image;
      eventModelEdit.latitude = this.latitude;
      eventModelEdit.longitude = this.longitude;

      if (this.photo) {
         eventModelEdit.image = Guid.create().toString();
         const response = await fetch(this.photo);
         const blob = await response.blob();
         const formData = new FormData();
         formData.append('file', blob, `${eventModelEdit.image}.jpg`);
         const url = `${environment.apiUrl}/file`;
         this._http
            .post(url, formData)
            .pipe(finalize(() => {}))
            .subscribe();
      }

      this._eventService.update(eventModelEdit).subscribe({
         next: _ => {
            this._toastService.display('Cet événement a été modifié', 'checkmark');
            this._router.navigate(['user/event/']);
         },
         error: _ => {},
      });
   }

   /* Delete --- */

   async presentAlert() {
      const alert = await this._alertController.create({
         header: 'Voulez-vous supprimer cet événement ?',
         buttons: [
            {
               text: 'Non',
               role: 'cancel',
               handler: () => {},
            },
            {
               text: 'Oui',
               role: 'confirm',
               handler: () => {
                  this.deleteActivity();
               },
            },
         ],
      });
      await alert.present();
   }

   deleteActivity() {
      this._eventService.delete(this.eventModel.meetingId).subscribe({
         next: async _ => {
            this._toastService.display('Cet événement a été supprimé', 'checkmark');
            this._router.navigate(['user/event/']);
         },
         error: _ => {},
      });
   }
}
