import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ActivityAdd} from 'src/app/models/activityAdd.model';
import {ActivityService} from 'src/app/services/activity.service';
import {ModalController} from '@ionic/angular';
import {Guid} from 'guid-typescript';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {ModalMapComponent} from '../modal-map/modal-map.component';
import {environment} from 'src/environments/environment';
import {Geolocation} from '@capacitor/geolocation';
import {BehaviorSubject} from 'rxjs';
import {Coordonnees} from 'src/app/models/coordonnees.model';
import {ModalImageCroppingComponent} from '../../option/modal-image-cropping/modal-image-cropping.component';
import {ToastService} from 'src/app/services/toast.service';

@Component({
   selector: 'app-activity-add',
   templateUrl: './activity-add.page.html',
})
export class ActivityAddPage implements OnInit {
   fg!: FormGroup;
   showPicker: boolean = false;
   dateValue: Date = new Date();
   latitude: number;
   longitude: number;
   photo: string | null = null;

   constructor(
      private readonly _activityService: ActivityService,
      private readonly _formBuilder: FormBuilder,
      private readonly _router: Router,
      private readonly _http: HttpClient,
      private readonly _modalCtrl: ModalController,
      private readonly _toastService: ToastService
   ) {}

   ionViewDidEnter(): void {
      this.GetPosition();
   }

   ngOnInit() {
      this.initForm();
   }

   initForm(): void {
      this.fg = this._formBuilder.group({
         title: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
         description: null,
         isPublic: [false, [Validators.required]],
      });
   }

   get title() {
      return this.fg.get('title');
   }

   dateChanged(value: any): void {
      this.dateValue = value;
      this.showPicker = false;
   }

   /* Map --- */

   GetPosition() {
      Geolocation.getCurrentPosition()
         .then(resp => {
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
            console.log('Current position:', this.latitude, this.longitude);
         })
         .catch(_ => {
            this.latitude = 50.85034;
            this.longitude = 4.35171;
         });
   }

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
            this.photo = value;
         }
      });

      modal.onDidDismiss().then(_ => {
         mySubject.unsubscribe();
      });
   }

   public removePhoto() {
      this.photo = null;
   }

   async onSubmit() {
      if (this.fg.invalid) {
         return;
      }
      const activity: ActivityAdd = this.fg.value;
      activity.date = this.dateValue; //.toISOString();
      activity.latitude = this.latitude;
      activity.longitude = this.longitude;

      if (this.photo) {
         activity.image = Guid.create().toString();
         const response = await fetch(this.photo);
         const blob = await response.blob();
         const formData = new FormData();
         formData.append('file', blob, `${activity.image}.jpg`);
         const url = `${environment.apiUrl}/file`;
         this._http
            .post(url, formData)
            .pipe(finalize(() => {}))
            .subscribe();
      }

      this._activityService.add(activity).subscribe({
         next: _ => {
            this._toastService.display('Cette action a été ajoutée', 'checkmark');
            this._router.navigate(['user/activity/']);
         },
         error: _ => {},
      });
   }
}
