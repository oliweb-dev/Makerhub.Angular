import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
   providedIn: 'root',
})
export class ToastService {
   constructor(private readonly _toastController: ToastController) {}

   async display(
      message: any,
      icon: string,
      color: string = 'success',
      duration: number = 2000,
      position: 'top' | 'middle' | 'bottom' = 'top'
   ) {
      (
         await this._toastController.create({
            color,
            message,
            duration,
            icon,
            position,
         })
      ).present();
   }
}
