import { Activity } from './activity.model';

export interface Filter {
   displayPublicActivity: boolean;
}

export interface ActivityBehavior {
   filter: Filter;
   activityList: Activity[];
}
