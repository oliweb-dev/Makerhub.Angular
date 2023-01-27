import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
   constructor(private readonly userService: UserService) {}

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      if (this.userService.token$.value) {
         const clone = request.clone({
            setHeaders: {Authorization: 'Bearer ' + this.userService.token$.value},
         });
         return next.handle(clone);
      }
      return next.handle(request);
   }
}
