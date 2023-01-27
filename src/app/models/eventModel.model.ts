export interface EventModel {
   meetingId: number;
   date: string;
   title: string;
   description?: string;
   image?: string;
   userPseudo: string;
   userId: number;
   minParticipant: number;
   maxParticipant: number;
   latitude: number;
   longitude: number;
   isRegistered: boolean;
   isLiked: boolean;
   numberOfLikes: number;
   numberOfParticipants: number;
}
