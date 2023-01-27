import {Activity} from './activity.model';
import {EventModel} from './eventModel.model';

export interface UserHome {
   firstname: string;
   lastname: string;
   pseudo: string;
   image: string;
   numberOfActivities: number;
   numberOfMeetings: number;
   activities: Activity[];
   meetings: EventModel[];
}
