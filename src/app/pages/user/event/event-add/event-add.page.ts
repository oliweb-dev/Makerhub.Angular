import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {Geolocation} from '@capacitor/geolocation';
import {Coordonnees} from 'src/app/models/coordonnees.model';
import {ModalMapComponent} from '../../activity/modal-map/modal-map.component';
import {EventModelAdd} from 'src/app/models/eventModelAdd.model';
import {Guid} from 'guid-typescript';
import {environment} from 'src/environments/environment';
import {finalize} from 'rxjs/operators';
import {EventService} from 'src/app/services/event.service';
import {ModalImageCroppingComponent} from '../../option/modal-image-cropping/modal-image-cropping.component';
import {ToastService} from 'src/app/services/toast.service';

@Component({
   selector: 'app-event-add',
   templateUrl: './event-add.page.html',
})
export class EventAddPage implements OnInit {
   fg!: FormGroup;
   showPicker: boolean = false;
   dateValue: Date = new Date();
   latitude: number;
   longitude: number;
   photo: string | null = null;

   constructor(
      private readonly _eventService: EventService,
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

   /* Form --- */

   initForm(): void {
      this.fg = this._formBuilder.group(
         {
            title: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            description: [null],
            minParticipant: [
               2,
               [Validators.required, Validators.min(1), Validators.max(200), Validators.pattern('^[0-9]+$')],
            ],
            maxParticipant: [
               6,
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
      const min = fg.get('minParticipant')?.value;
      const max = fg.get('maxParticipant')?.value;
      if (!min || !max || min <= max) {
         return null;
      }
      return {minMax: true};
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
         })
         .catch(err => {
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
      const event: EventModelAdd = this.fg.value;
      event.date = this.dateValue; //.toISOString();
      event.latitude = this.latitude;
      event.longitude = this.longitude;

      if (this.photo) {
         event.image = Guid.create().toString();
         const response = await fetch(this.photo);
         const blob = await response.blob();
         const formData = new FormData();
         formData.append('file', blob, `${event.image}.jpg`);
         const url = `${environment.apiUrl}/file`;
         this._http
            .post(url, formData)
            .pipe(finalize(() => {}))
            .subscribe();
      }

      this._eventService.add(event).subscribe({
         next: _ => {
            this._toastService.display('Cet événement a été ajouté', 'checkmark');
            this._router.navigate(['user/event/']);
         },
      });
   }
}
