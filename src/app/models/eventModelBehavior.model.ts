import {EventModel} from './eventModel.model';

export interface Filter {
   displayPastEvent: boolean;
}

export interface EventModelBehavior {
   filter: Filter;
   eventList: EventModel[];
}
