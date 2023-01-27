import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {Activity} from 'src/app/models/activity.model';
import {ActivityService} from 'src/app/services/activity.service';
import {ModalMapComponent} from '../modal-map/modal-map.component';
import {ActivityEdit} from 'src/app/models/activityEdit.model';
import {BehaviorSubject} from 'rxjs';
import {Coordonnees} from 'src/app/models/coordonnees.model';
import {environment} from 'src/environments/environment';
import {Guid} from 'guid-typescript';
import {finalize} from 'rxjs/operators';
import {ModalImageCroppingComponent} from '../../option/modal-image-cropping/modal-image-cropping.component';
import {ToastService} from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
   selector: 'app-activity-edit',
   templateUrl: './activity-edit.page.html',
})
export class ActivityEditPage implements OnInit {
   activity: Activity | undefined;
   fg!: FormGroup;
   showPicker: boolean = false;
   latitude: number;
   longitude: number;
   photo: string | null = null;
   isPhotoModified: boolean = false;
   apiUrl: string = environment.apiUrl;
   canDelete: boolean = false;

   constructor(
      private readonly _activityService: ActivityService,
      private readonly _formBuilder: FormBuilder,
      private readonly _route: ActivatedRoute,
      private readonly _router: Router,
      private readonly _http: HttpClient,
      private readonly _modalCtrl: ModalController,
      private readonly _alertController: AlertController,
      private readonly _toastService: ToastService,
      private readonly _userService: UserService
   ) {}

   ngOnInit() {
      const activityId: string | null = this._route.snapshot.paramMap.get('id');
      if (activityId) {
         this.activity = this._activityService.activityBehavior$.value.activityList.find(a => a.activityId === +activityId);
         this.latitude = this.activity.latitude;
         this.longitude = this.activity.longitude;
         this.canDelete = this.activity.userId === this._userService.userId$.value;
         this.initForm();
      }
   }

   initForm(): void {
      this.fg = this._formBuilder.group({
         title: [
            this.activity.title,
            [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
         ],
         description: [this.activity.description],
         isPublic: [this.activity.isPublic, [Validators.required]],
      });
   }

   get title() {
      return this.fg.get('title');
   }

   dateChanged(value: any): void {
      this.activity.date = value;
      this.showPicker = false;
   }

   /* Map --- */

   async openModal() {
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
      this.activity.image = null;
      this.isPhotoModified = true;
   }

   async onSubmit() {
      if (this.fg.invalid) {
         return;
      }
      const activityEdit: ActivityEdit = this.fg.value;
      activityEdit.activityId = this.activity.activityId;
      activityEdit.date = this.activity.date;
      activityEdit.latitude = this.latitude;
      activityEdit.longitude = this.longitude;
      activityEdit.image = this.activity.image;

      if (this.photo) {
         activityEdit.image = Guid.create().toString();
         const response = await fetch(this.photo);
         const blob = await response.blob();
         const formData = new FormData();
         formData.append('file', blob, `${activityEdit.image}.jpg`);
         const url = `${environment.apiUrl}/file`;
         console.log(url);
         this._http
            .post(url, formData)
            .pipe(finalize(() => {}))
            .subscribe();
      }

      this._activityService.update(activityEdit).subscribe({
         next: _ => {
            this._toastService.display('Cette action a été modifiée', 'checkmark');
            this._router.navigate(['user/activity/']);
         },
         error: _ => {},
      });
   }

   /* Delete --- */

   async presentAlert() {
      const alert = await this._alertController.create({
         header: 'Voulez-vous supprimer cette action ?',
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
      this._activityService.delete(this.activity.activityId).subscribe({
         next: _ => {
            this._toastService.display('Cette action a été supprimée', 'checkmark');
            this._router.navigate(['user/activity/']);
         },
         error: _ => {},
      });
   }
}
