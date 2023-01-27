import {Component, Input} from '@angular/core';
import {EventModel} from 'src/app/models/eventModel.model';

@Component({
   selector: 'app-popup-meeting',
   templateUrl: './popup-meeting.component.html',
})
export class PopupMeetingComponent {
   @Input()
   eventModel: EventModel;
}
