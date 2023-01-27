import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {format, parseISO} from 'date-fns';
import {BehaviorSubject} from 'rxjs';
import {User} from 'src/app/models/user.model';
import {UserEdit} from 'src/app/models/userEdit.model';
import {UserService} from 'src/app/services/user.service';
import {ModalImageCroppingComponent} from '../modal-image-cropping/modal-image-cropping.component';
import {Guid} from 'guid-typescript';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {ToastService} from 'src/app/services/toast.service';
import {HomeService} from 'src/app/services/home.service';

@Component({
   selector: 'app-user-edit',
   templateUrl: './user-edit.page.html',
})
export class UserEditPage implements OnInit {
   user: User | undefined;
   fg!: FormGroup;
   formattedString!: string;
   photo: string | null = null;
   isPhotoModified: boolean = false;

   constructor(
      private readonly _userService: UserService,
      private readonly _formBuilder: FormBuilder,
      private readonly _modalCtrl: ModalController,
      private readonly _http: HttpClient,
      private readonly _toastService: ToastService,
      private readonly _homeService: HomeService
   ) {}

   ngOnInit() {
      this._userService.get().subscribe({
         next: response => {
            this.user = response;
            this.initForm();
         },
         error: _ => {},
      });
   }

   initForm(): void {
      this.fg = this._formBuilder.group({
         firstname: [this.user.firstname, [Validators.required]],
         lastname: [this.user.lastname, [Validators.required]],
         email: [this.user.email],
         pseudo: [this.user.pseudo],
         dateCreated: [this.displayDate(this.user.dateCreated)],
      });
   }

   displayDate(date: string): string {
      return format(parseISO(date), 'dd-MM-yyyy à HH:mm');
   }

   async openModal() {
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
      this.user.image = null;
      this.isPhotoModified = true;
   }

   async onSubmit() {
      if (this.fg.invalid) {
         return;
      }
      const userEdit: UserEdit = this.fg.value;
      userEdit.image = this.user.image;

      if (this.photo) {
         userEdit.image = Guid.create().toString();
         const response = await fetch(this.photo);
         const blob = await response.blob();
         const formData = new FormData();
         formData.append('file', blob, `${userEdit.image}.jpg`);
         const url = `${environment.apiUrl}/file`;
         this._http
            .post(url, formData)
            .pipe(finalize(() => {}))
            .subscribe();
      }
      this._userService.update(userEdit).subscribe({
         next: _ => {
            this._homeService.loadDataHomePage();
            this._toastService.display('Informations modifiées', 'checkmark');
         },
         error: _ => {},
      });
   }
}
