import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ActivityEditPageRoutingModule} from './activity-edit-routing.module';
import {ActivityEditPage} from './activity-edit.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
   imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ActivityEditPageRoutingModule, SharedModule],
   declarations: [ActivityEditPage],
})
export class ActivityEditPageModule {}
