import { User } from './user.model';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  status: LeadStatus;
  source?: LeadSource;
  score?: number;
  estimatedValue?: number;
  rating?: string;
  notes?: string;
  description?: string;
  assignedTo?: User;
  createdAt: string;
}

export enum LeadStatus {
  NEW = 'NEW', CONTACTED = 'CONTACTED', QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED', NURTURING = 'NURTURING', CONVERTED = 'CONVERTED', LOST = 'LOST'
}

export enum LeadSource {
  WEBSITE_FORM = 'WEBSITE_FORM', MANUAL_ENTRY = 'MANUAL_ENTRY', REFERRAL = 'REFERRAL',
  CAMPAIGN = 'CAMPAIGN', IMPORT = 'IMPORT', SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  COLD_CALL = 'COLD_CALL', PARTNER = 'PARTNER', EVENT = 'EVENT', OTHER = 'OTHER'
}
