export interface EventModelEdit {
  meetingId: number;
  date: string;
  title: string;
  description?: string;
  image?: string;
  minParticipant: number;
  maxParticipant: number;
  latitude: number;
  longitude: number;
}
