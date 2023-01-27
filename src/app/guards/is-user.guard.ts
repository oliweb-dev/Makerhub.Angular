import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable({
   providedIn: 'root',
})
export class IsUserGuard implements CanActivate {
   constructor(private readonly userService: UserService, private readonly router: Router) {}

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isUser = this.userService.role$.value === 'USER' || this.userService.role$.value === 'ADMIN';
      if (!isUser) {
         this.router.navigate(['/login']);
      }
      return isUser;
   }
}
