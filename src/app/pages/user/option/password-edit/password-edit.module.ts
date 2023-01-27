import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PasswordEditPageRoutingModule} from './password-edit-routing.module';
import {PasswordEditPage} from './password-edit.page';

@NgModule({
   imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PasswordEditPageRoutingModule],
   declarations: [PasswordEditPage],
})
export class PasswordEditPageModule {}
