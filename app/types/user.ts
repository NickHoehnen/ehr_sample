

export interface UserFields {
  email: string;
  birthdate: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateCreated: Date;
  trainerId: string;
  role: 'client' | 'admin';
  id: string;
}