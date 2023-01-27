import {Component, Input, ViewChild} from '@angular/core';
import {Camera, CameraResultType} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {ImageCroppedEvent, ImageCropperComponent, ImageTransform} from 'ngx-image-cropper';
import {BehaviorSubject} from 'rxjs';

@Component({
   selector: 'app-modal-image-cropping',
   templateUrl: './modal-image-cropping.component.html',
})
export class ModalImageCroppingComponent {
   @ViewChild('cropper') cropper: ImageCropperComponent;
   myImage: any = null;
   croppedImage: any = '';
   transform: ImageTransform = {};
   isMobile = Capacitor.getPlatform() !== 'web';
   @Input() mySubject: BehaviorSubject<string>;

   constructor(
      private readonly modalCtrl: ModalController,
      private loadingCtrl: LoadingController,
      private readonly _toastController: ToastController
   ) {}

   async selectImage() {
      const image = await Camera.getPhoto({
         quality: 60,
         allowEditing: true,
         resultType: CameraResultType.Base64,
      });
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.myImage = `data:image/jpeg;base64,${image.base64String}`;
      this.croppedImage = null;
   }

   cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
   }

   confirm() {
      return this.modalCtrl.dismiss(null, 'confirm');
   }

   // Called when cropper is ready
   imageLoaded() {
      this.loadingCtrl.dismiss();
   }

   // Called when we finished editing (because autoCrop is set to false)
   imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.mySubject.next(this.croppedImage);
   }

   // We encountered a problem while loading the image
   async loadImageFailed() {
      this.loadingCtrl.dismiss();
      this.myImage = null;

      (
         await this._toastController.create({
            color: 'danger',
            message: "Le format de l'image est incorrect",
            duration: 2000,
            icon: 'warning',
            position: 'top',
         })
      ).present();
   }

   // Manually trigger the crop
   cropImage() {
      this.cropper.crop();
      this.myImage = null;
   }
}
