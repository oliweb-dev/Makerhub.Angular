import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {EventModel} from '../models/eventModel.model';
import {environment} from 'src/environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {EventModelAdd} from '../models/eventModelAdd.model';
import {EventModelId} from '../models/eventModelId.model';
import {EventModelEdit} from '../models/eventModelEdit.model';
import {HomeService} from './home.service';
import {EventModelBehavior} from '../models/eventModelBehavior.model';

@Injectable({
   providedIn: 'root',
})
export class EventService {
   eventBehavior$: BehaviorSubject<EventModelBehavior | null> =
      new BehaviorSubject<EventModelBehavior | null>({
         filter: {displayPastEvent: false},
         eventList: [],
      });

   constructor(private readonly _http: HttpClient, private readonly _homeService: HomeService) {
      this.loadData();
   }

   loadData(): void {
      let url = `${environment.apiUrl}/meeting/upcoming-meetings`;
      if (this.eventBehavior$.value.filter.displayPastEvent === true) {
         url = `${environment.apiUrl}/meeting`;
      }
      this._http
         .get<EventModel[]>(url)
         .pipe(catchError(error => this.handleError(error, [])))
         .subscribe({
            next: data => {
               this.eventBehavior$.next({
                  ...this.eventBehavior$.value,
                  eventList: data,
               });
            },
         });
   }

   toogleDisplayPastEvent(display: boolean) {
      const eventModelBehavior: EventModelBehavior = this.eventBehavior$.value;
      eventModelBehavior.filter.displayPastEvent = display;
      this.eventBehavior$.next(eventModelBehavior);
      this.loadData();
   }

   add(eventAdd: EventModelAdd): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/meeting`, eventAdd).pipe(
         tap(_ => {
            this.loadData();
            this._homeService.loadDataHomePage();
         })
      );
   }

   update(eventEdit: EventModelEdit): Observable<void> {
      return this._http.put<void>(`${environment.apiUrl}/meeting`, eventEdit).pipe(
         tap(_ => {
            this.loadData();
            this._homeService.loadDataHomePage();
         })
      );
   }

   delete(id: number): Observable<void> {
      return this._http.delete<void>(`${environment.apiUrl}/meeting/${id}`).pipe(
         tap(_ => {
            this.loadData();
            this._homeService.loadDataHomePage();
         })
      );
   }

   eventSubscribe(eventId: EventModelId): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/meeting/meeting-subscribe`, eventId).pipe(
         tap(_ => {
            const data = this.eventBehavior$.value.eventList;
            const index = data.findIndex(e => e.meetingId === eventId.meetingId);
            if (index !== -1) {
               data[index].isRegistered = true;
               data[index].numberOfParticipants++;
               //this.eventBehavior$.next(data);
               this._homeService.loadDataHomePage();
            } else {
               this.loadData();
               this._homeService.loadDataHomePage();
            }
         })
      );
   }

   eventUnsubscribe(eventId: EventModelId): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/meeting/meeting-unsubscribe`, eventId).pipe(
         tap(_ => {
            const data = this.eventBehavior$.value.eventList;
            const index = data.findIndex(e => e.meetingId === eventId.meetingId);
            if (index !== -1) {
               data[index].isRegistered = false;
               data[index].numberOfParticipants--;
               //this.eventList$.next(data);
               this._homeService.loadDataHomePage();
            } else {
               this.loadData();
               this._homeService.loadDataHomePage();
            }
         })
      );
   }

   like(eventId: EventModelId): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/meeting/meeting-like/`, eventId).pipe(
         tap(_ => {
            const data = this.eventBehavior$.value.eventList;
            const index = data.findIndex(e => e.meetingId === eventId.meetingId);
            if (index !== -1) {
               data[index].isLiked = true;
               data[index].numberOfLikes++;
               //this.eventList$.next(data);
               this._homeService.loadDataHomePage();
            } else {
               this.loadData();
               this._homeService.loadDataHomePage();
            }
         })
      );
   }

   dislike(eventId: EventModelId): Observable<void> {
      return this._http.post<void>(`${environment.apiUrl}/meeting/meeting-dislike/`, eventId).pipe(
         tap(_ => {
            const data = this.eventBehavior$.value.eventList;
            const index = data.findIndex(e => e.meetingId === eventId.meetingId);
            if (index !== -1) {
               data[index].isLiked = false;
               data[index].numberOfLikes--;
               //this.eventList$.next(data);
               this._homeService.loadDataHomePage();
            } else {
               this.loadData();
               this._homeService.loadDataHomePage();
            }
         })
      );
   }

   private handleError(error: any, errorValue: any): Observable<any> {
      console.error(error.error);
      return of(errorValue);
   }
}
