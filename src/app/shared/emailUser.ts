export interface EmailUser {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    token: string;
    role: string;
    resetPasswordToken: string;
    resetPasswordExpiry: Date;
  }
