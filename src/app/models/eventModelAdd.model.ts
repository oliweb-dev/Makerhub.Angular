export interface EventModelAdd {
  date: Date;
  title: string;
  description?: string;
  image?: string;
  minParticipant: number;
  maxParticipant: number;
  latitude: number;
  longitude: number;
}
