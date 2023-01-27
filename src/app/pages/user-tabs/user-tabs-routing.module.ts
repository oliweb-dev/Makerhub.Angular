import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserTabsPage} from './user-tabs.page';
import {IsUserGuard} from 'src/app/guards/is-user.guard';

const routes: Routes = [
   {
      path: '',
      component: UserTabsPage,
      children: [
         {
            path: 'home',
            children: [
               {
                  path: '',
                  canActivate: [IsUserGuard],
                  loadChildren: () => import('../../pages/user/home/home.module').then(m => m.HomePageModule),
               },
            ],
         },
         {
            path: 'activity',
            children: [
               {
                  path: '',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../user/activity/activity/activity.module').then(m => m.ActivityPageModule),
               },
               {
                  path: 'add',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/activity/activity-add/activity-add.module').then(
                        m => m.ActivityAddPageModule
                     ),
               },
               {
                  path: 'map',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/activity/activity-map/activity-map.module').then(
                        m => m.ActivityMapPageModule
                     ),
               },
               {
                  path: 'view/:id',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/activity/activity-view/activity-view.module').then(
                        m => m.ActivityViewPageModule
                     ),
               },
               {
                  path: 'edit/:id',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/activity/activity-edit/activity-edit.module').then(
                        m => m.ActivityEditPageModule
                     ),
               },
            ],
         },
         {
            path: 'event',
            children: [
               {
                  path: '',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/event/event-home/event-home.module').then(
                        m => m.EventHomePageModule
                     ),
               },
               {
                  path: 'add',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/event/event-add/event-add.module').then(
                        m => m.EventAddPageModule
                     ),
               },
               {
                  path: 'map',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/event/event-map/event-map.module').then(
                        m => m.EventMapPageModule
                     ),
               },
               {
                  path: 'edit/:id',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/event/event-edit/event-edit.module').then(
                        m => m.EventEditPageModule
                     ),
               },
               {
                  path: 'view/:id',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/event/event-view/event-view.module').then(
                        m => m.EventViewPageModule
                     ),
               },
            ],
         },
         {
            path: 'option',
            children: [
               {
                  path: '',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/option/option/option.module').then(m => m.OptionPageModule),
               },
               {
                  path: 'edit-user',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/option/user-edit/user-edit.module').then(
                        m => m.UserEditPageModule
                     ),
               },
               {
                  path: 'edit-password',
                  canActivate: [IsUserGuard],
                  loadChildren: () =>
                     import('../../pages/user/option/password-edit/password-edit.module').then(
                        m => m.PasswordEditPageModule
                     ),
               },
            ],
         },
         {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
         },
      ],
   },
   {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
   },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class UserTabsPageRoutingModule {}
