import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {UserEditPageRoutingModule} from './user-edit-routing.module';
import {UserEditPage} from './user-edit.page';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
      UserEditPageRoutingModule,
      SharedModule,
   ],
   declarations: [UserEditPage],
})
export class UserEditPageModule {}
