import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityAddPage } from './activity-add.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityAddPageRoutingModule {}
