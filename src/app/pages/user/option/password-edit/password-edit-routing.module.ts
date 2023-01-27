import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordEditPage } from './password-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordEditPageRoutingModule {}
