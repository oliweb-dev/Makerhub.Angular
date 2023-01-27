import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventHomePageRoutingModule } from './event-home-routing.module';

import { EventHomePage } from './event-home.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventHomePageRoutingModule,
    SharedModule
  ],
  declarations: [EventHomePage]
})
export class EventHomePageModule {}
