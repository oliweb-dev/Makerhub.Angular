import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastService} from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
   constructor(private readonly _toastService: ToastService) {}

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      return next.handle(request).pipe(
         catchError(xhr => {
            switch (xhr.status) {
               case 400:
                  this._toastService.display(
                     typeof xhr.error === 'string' ? xhr.error : Object.values(xhr.error.errors).join(', '),
                     'warning-outline',
                     'warning',
                     3000
                  );
                  break;
               case 401:
               case 403:
                  this._toastService.display(xhr.error, 'warning-outline', 'warning');
                  break;
               case 404:
                  this._toastService.display("L'adresse est introuvable", 'warning-outline', 'warning');
                  break;
               default:
                  this._toastService.display('La connexion au serveur a échoué', 'warning-outline', 'danger');
                  break;
            }
            throw xhr;
         })
      );
   }
}
