import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {UserTabsPageRoutingModule} from './user-tabs-routing.module';
import {UserTabsPage} from './user-tabs.page';
import {ModalMapComponent} from '../user/activity/modal-map/modal-map.component';
import {ModalImageCroppingComponent} from '../user/option/modal-image-cropping/modal-image-cropping.component';
import {ImageCropperModule} from 'ngx-image-cropper';

@NgModule({
   imports: [CommonModule, FormsModule, IonicModule, UserTabsPageRoutingModule, ImageCropperModule],
   declarations: [UserTabsPage, ModalMapComponent, ModalImageCroppingComponent],
})
export class UserTabsPageModule {}
