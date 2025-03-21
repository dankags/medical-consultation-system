
/* eslint-disable no-unused-vars */

declare interface CalendarEvent {
  title: string;
  description: string;
  locationUrl: string;  // URL that will be used as the location (link)
  startDate: string; // ISO 8601 format: '2025-01-20T10:00:00Z'
  endDate: string; 
}

declare type NavigationLink={
  name:string;
  href:string;
  active:boolean;
  Icon?: () => JSX.Element;
}
declare interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  image?:string;
  coverImage?:string
}



declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
  
  declare type Gender = "male" | "female" ;
  declare type Status = "pending" | "scheduled" | "cancelled";
  
  declare interface CreateUserParams {
    name: string;
    email: string;
    phone: string;
    gender: Gender;
    birthDate:Date;
    clerkId:string|null
  }
  declare interface User extends CreateUserParams {
    $id: string;
  }
  
  declare interface RegisterUserParams extends CreateUserParams {
    userId: string;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    primaryPhysician: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    allergies: string | undefined;
    currentMedication: string | undefined;
    familyMedicalHistory: string | undefined;
    pastMedicalHistory: string | undefined;
    identificationType: string | undefined;
    identificationNumber: string | undefined;
    identificationDocument: FormData | undefined;
    privacyConsent: boolean;
  }
  
  declare type CreateAppointmentParams = {
    doctor: string;
    user: string;
    reason: string;
    schedule: Date;
    status: Status;
    note: string | undefined;
  };
  
  declare type UpdateAppointmentParams = {
    appointmentId: string;
    userId: string;
    appointment: Appointment;
    type: string;
  };

  declare type ProcessedPayment={
    id: string;
    status: string;
    paidBy: {
      name: string;
      id: string;
      role:"doctor"|"user"| "admin";
    };
    amount: number;
    date:Date;
  }

  declare interface Feedback{
    user:string,
    userFriendly: boolean,
    mpesaIntegration: boolean,
    recommendation:boolean,
    accuracy:boolean,
    additionalFeatures?:string,
    challenges?:string,
    impact?:string,
    improvements?:string
  }