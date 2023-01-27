import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ActivityPageRoutingModule} from './activity-routing.module';
import {ActivityPage} from './activity.page';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
   imports: [CommonModule, FormsModule, IonicModule, ActivityPageRoutingModule, SharedModule],
   declarations: [ActivityPage],
})
export class ActivityPageModule {}
