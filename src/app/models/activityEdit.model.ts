export interface ActivityEdit {
  activityId: number;
  date: Date;
  title: string;
  description?: string;
  image?: string;
  latitude: number;
  longitude: number;
  isPublic: boolean;
}
