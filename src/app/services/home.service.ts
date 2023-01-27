import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {UserHome} from '../models/userHome.model';


@Injectable({
   providedIn: 'root',
})
export class HomeService {
   userHome$: BehaviorSubject<UserHome | null> = new BehaviorSubject<UserHome | null>(null);

   constructor(private readonly _http: HttpClient) {
      this.loadDataHomePage();
   }

   loadDataHomePage(): void {
      this._http
         .get<UserHome>(`${environment.apiUrl}/user/home`)
         .pipe(catchError(error => this.handleError(error, [])))
         .subscribe({
            next: data => {
               this.userHome$.next(data);
            },
         });
   }

   private handleError(error: any, errorValue: any) {
      console.log(error);
      console.log(error.error);
      return of(errorValue);
   }
}
