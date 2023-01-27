export interface Activity {
   activityId: number;
   date: Date;
   title: string;
   description?: string;
   image?: string;
   userPseudo: string;
   userId: number;
   latitude: number;
   longitude: number;
   isLiked: boolean;
   numberOfLikes: number;
   isPublic: boolean;
}
