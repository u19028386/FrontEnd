export interface User {
    userId: number;
    firstName : string;
    lastName : string;
    isActive: boolean;
    emailAddress: string;
    profilePicture: File;
    fileName?: string; 
    userRoleId: number;
    titleId: number;
}
