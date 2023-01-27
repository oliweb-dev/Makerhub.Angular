import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import jwtDecode from 'jwt-decode';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {userRegister} from '../models/userRegister.model';
import {UserLogin} from '../models/userLogin.model';
import {UserChangePassword} from '../models/userChangePassword';
import {UserEdit} from '../models/userEdit.model';
import {User} from '../models/user.model';

@Injectable({
   providedIn: 'root',
})
export class UserService {
   token$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
   role$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
   userId$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

   constructor(private readonly _http: HttpClient) {}

   register(userRegister: userRegister): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/user/register`, userRegister);
   }

   changePassword(changePassword: UserChangePassword): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/user/change-password`, changePassword);
   }

   login(form: UserLogin): Observable<any> {
      return this._http.post<any>(`${environment.apiUrl}/authentication`, form).pipe(
         tap(response => {
            this.token$.next(response.token);
            const decodedToken: any = jwtDecode(response.token);
            const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            this.role$.next(role);
            const userId =
               decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            this.userId$.next(userId);
         })
      );
   }

   get(): Observable<User> {
      return this._http.get<User>(`${environment.apiUrl}/user/`);
   }

   update(userEdit: UserEdit): Observable<void> {
      return this._http.put<void>(`${environment.apiUrl}/user`, userEdit);
   }

   logout(): void {
      this.role$.next(null);
      this.token$.next(null);
   }
}
