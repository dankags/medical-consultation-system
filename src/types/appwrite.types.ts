import { Models } from "node-appwrite";
import { Gender, Status } from '@/types';



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



export interface AppointmentUser{
    id?:string,
    doctorId?:string
    name: string,
    email?:string,
    image?: string,
    reason?:string,
}

export interface Appointment extends Models.Document {
    doctor: AppointmentUser;
    patient: AppointmentUser;
    id: string,
    appointmentDate: Date,
    status: Status;
    note?: string | undefined;
  cancellationReason?: string | null;
  paymentStatus?:"paid"|"unpaid"
}

export interface DoctorAppointments {
  id:string,
  appointmentDate: Date,
  status: Status;
  patient: AppointmentUser;
  doctor: AppointmentUser;
  note?: string | undefined;
  cancellationReason?: string | null;
}

export interface DoctorInfo{
  user:string
  name: string
  description: string
  title?: string
  speciality:string[]
  rating?:number
}