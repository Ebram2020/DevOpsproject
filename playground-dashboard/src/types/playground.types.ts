// src/types.ts
export interface Time {
    openTimeId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }
  
  export interface StadiumImage {
    stadiumImageId: number;
    stadiumImageUrl: string;
  }
  
  export interface Owner {
    ownerId: number;
    userName: string;
    ownerProfilePictureUrl: string | null;
  }
  
  export interface StadiumData {
    stadiumId: number;
    name: string;
    description: string;
    address: string;
    location: string | null;
    categoryId: number;
    pricePerHour: number;
    minHoursReservation: number;
    approvalStatus: number;
    openTimes: Time[];
    images: StadiumImage[];
    rate: number;
    owner: Owner;
    proofOfOwnershipUrl:string;
  }
  
 export interface Review {
    reviewerId: string;
    userName: string;
    profilePictureUrl: string;
    comment: string;
}
