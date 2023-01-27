import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityEditPage } from './activity-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityEditPageRoutingModule {}
