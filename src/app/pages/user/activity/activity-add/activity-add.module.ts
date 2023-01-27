import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ActivityAddPageRoutingModule} from './activity-add-routing.module';
import {ActivityAddPage} from './activity-add.page';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
      ActivityAddPageRoutingModule,
      SharedModule,
   ],
   declarations: [ActivityAddPage],
})
export class ActivityAddPageModule {}
