import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityMapPageRoutingModule } from './activity-map-routing.module';

import { ActivityMapPage } from './activity-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityMapPageRoutingModule
  ],
  declarations: [ActivityMapPage]
})
export class ActivityMapPageModule {}
