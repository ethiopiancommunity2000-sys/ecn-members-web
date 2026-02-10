
export {};

declare global {
  interface Window {
    __APP_CONFIG__?: {
      API_URL?: string;
    };
  }
}


export type Result<T> = {
  isSuccess: boolean;
  value?: T;
  error?: string;
};

export type MemberFileDto = {
  id: string;
  fileName: string;
  filePath: string;
  fileDescription?: string;
  contentType: string;
};

export type Member = {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  registerDate: string;
  phoneNumber: string;
  receiverId?: string;
  isActive: boolean;
  isAdmin: boolean;
  userName?: string;
  password?: string;
  displayName?: string;
  bio?: string;
  addresses?: Address[];
  familyMembers?: FamilyMember[];
  memberFiles?: MemberFile[];
  payments?: Payment[];
  incidents?: Incident[];
};

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type FamilyMember = {
  id: string;
  memberFamilyFirstName: string;
  memberFamilyMiddleName: string;
  memberFamilyLastName: string;
  relationship: string;
};

export interface MemberFile {
  id: string;
  fileName: string;
  fileType?: string;
  size?: number;
  memberId: string;
  fileDescription?: string | null;
  paymentId?: string | null;
  downloadUrl: string;
}


export type Payment = {
  id: string;
  paymentAmount: number;
  paymentDate: string;
  paymentType: string;
  paymentRecurringType: string;
};

export type Incident = {
  id: string;
  incidentType: string;
  incidentDescription: string;
  paymentDate: string;
  incidentDate: string;
  eventNumber: number | string;
};

export type User = {
  username: string;
  token: string;
  email: string;
};

