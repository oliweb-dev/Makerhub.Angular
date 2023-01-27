import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {IsUserGuard} from './guards/is-user.guard';

const routes: Routes = [
   {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full',
   },
   {
      path: 'user',
      canActivate: [IsUserGuard],
      loadChildren: () => import('./pages/user-tabs/user-tabs.module').then(m => m.UserTabsPageModule),
   },
   {
      path: 'login',
      loadChildren: () => import('./pages/free/login/login.module').then(m => m.LoginPageModule),
   },
   {
      path: 'register',
      loadChildren: () => import('./pages/free/register/register.module').then(m => m.RegisterPageModule),
   },
];

@NgModule({
   imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
   exports: [RouterModule],
})
export class AppRoutingModule {}
