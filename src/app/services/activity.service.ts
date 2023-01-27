import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivityAdd} from 'src/app/models/activityAdd.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {Activity} from '../models/activity.model';
import {ActivityEdit} from '../models/activityEdit.model';
import {ActivityId} from '../models/activityId.model';
import {ActivityBehavior} from '../models/activityBehavior.model';
import {HomeService} from './home.service';

@Injectable({
   providedIn: 'root',
})
export class ActivityService {
   activityBehavior$: BehaviorSubject<ActivityBehavior | null> = new BehaviorSubject<ActivityBehavior | null>(
      {
         filter: {displayPublicActivity: false},
         activityList: [],
      }
   );

   constructor(private readonly _http: HttpClient, private readonly _homeService: HomeService) {
      this.loadData();
   }

   loadData(): void {
      let url = `${environment.apiUrl}/activity/GetAllByUser`;
      if (this.activityBehavior$.value.filter.displayPublicActivity === true) {
         url = `${environment.apiUrl}/activity`;
      }

      this._http
         .get<Activity[]>(url)
         .pipe(catchError(error => this.handleError(error, [])))
         .subscribe({
            next: data => {
               this.activityBehavior$.next({
                  ...this.activityBehavior$.value,
                  activityList: data,
               });
            },
         });
   }

   toogleDisplayPublicActivity(display: boolean) {
      const act: ActivityBehavior = this.activityBehavior$.value;
      act.filter.displayPublicActivity = display;
      this.activityBehavior$.next(act);
      this.loadData();
   }

   add(activity: ActivityAdd): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/activity`, activity).pipe(
         tap(_ => {
            this.loadData();
            this._homeService.loadDataHomePage();
         })
      );
   }

   getById(id: number): Observable<Activity | undefined> {
      return this._http
         .get<Activity>(`${environment.apiUrl}/activity/${id}`)
         .pipe(tap(response => console.log(response)));
   }

   update(activityEdit: ActivityEdit): Observable<void> {
      return this._http.put<void>(`${environment.apiUrl}/activity`, activityEdit).pipe(
         tap(_ => {
            this.loadData();
            this._homeService.loadDataHomePage();
         })
      );
   }

   delete(id: number): Observable<void> {
      return this._http.delete<void>(`${environment.apiUrl}/activity/${id}`).pipe(
         tap(_ => {
            this.loadData();
            this._homeService.loadDataHomePage();
         })
      );
   }

   like(activityId: ActivityId): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/activity/activity-like/`, activityId).pipe(
         tap(_ => {
            const data = this.activityBehavior$.value.activityList;
            const index = data.findIndex(a => a.activityId === activityId.activityId);
            if (index !== -1) {
               data[index].isLiked = true;
               data[index].numberOfLikes++;
               //this.activityList$.next(data);
               this._homeService.loadDataHomePage();
            } else {
               this.loadData();
               this._homeService.loadDataHomePage();
            }
         })
      );
   }

   dislike(activityId: ActivityId): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/activity/activity-dislike/`, activityId).pipe(
         tap(_ => {
            const activityArray: Activity[] = this.activityBehavior$.value.activityList.filter(
               a => a.activityId === activityId.activityId
            );
            if (activityArray.length === 1) {
               activityArray[0].isLiked = false;
               activityArray[0].numberOfLikes--;
               this._homeService.loadDataHomePage();
            } else {
               this.loadData();
               this._homeService.loadDataHomePage();
            }
         })
      );
   }

   private handleError(error: any, errorValue: any): Observable<any> {
      return of(errorValue);
   }
}
