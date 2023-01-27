import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityViewPageRoutingModule } from './activity-view-routing.module';

import { ActivityViewPage } from './activity-view.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityViewPageRoutingModule,
    SharedModule
  ],
  declarations: [ActivityViewPage]
})
export class ActivityViewPageModule {}
