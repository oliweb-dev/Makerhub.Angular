import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {EventAddPageRoutingModule} from './event-add-routing.module';
import {EventAddPage} from './event-add.page';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
      EventAddPageRoutingModule,
      SharedModule,
   ],
   declarations: [EventAddPage],
})
export class EventAddPageModule {}
