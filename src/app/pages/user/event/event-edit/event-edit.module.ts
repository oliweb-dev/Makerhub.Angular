import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {EventEditPageRoutingModule} from './event-edit-routing.module';
import {EventEditPage} from './event-edit.page';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
      EventEditPageRoutingModule,
      SharedModule,
   ],
   declarations: [EventEditPage],
})
export class EventEditPageModule {}
