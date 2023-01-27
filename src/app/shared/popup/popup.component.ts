import {Component, Input} from '@angular/core';
import {Activity} from 'src/app/models/activity.model';

@Component({
   selector: 'app-popup',
   templateUrl: './popup.component.html',
})
export class PopupComponent {
   @Input()
   activity: Activity;
}
