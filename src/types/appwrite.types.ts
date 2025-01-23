import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
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

export interface Doctor{
        name: string,
        reason:string,
}

export interface AppointmentPatient{
    id?:string,
    name: string,
    email:string,
}

export interface Appointment extends Models.Document {
    doctor: Doctor;
    patient: AppointmentPatient;
    id: string,
    appointmentDate: Date,
    status: Status;
    note?: string | undefined;
  cancellationReason?: string | null;
}