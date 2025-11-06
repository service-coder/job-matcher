export interface IntakeData {
  name: string;
  phone: string;
  email: string;
  address: string;
  company?: string;
  description: string;
  difficultAccess: boolean;
}

export interface IntakeForm extends IntakeData {}

