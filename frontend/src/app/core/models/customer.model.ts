export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  status?: string;
  type?: string;
  source?: string;
  rating?: string;
  notes?: string;
  tags?: string[];
  assignedTo?: User;
  createdAt: string;
  updatedAt?: string;
}

import { User } from './user.model';
