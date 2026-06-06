import { User } from './user.model';
import { Customer } from './customer.model';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  ticketNumber: string;
  customer?: Customer;
  assignedTo?: User;
  resolvedAt?: string;
  closedAt?: string;
  comments?: TicketComment[];
  createdAt: string;
}

export interface TicketComment {
  id: string;
  content: string;
  internal: boolean;
  author?: User;
  createdAt: string;
}

export enum TicketStatus { OPEN = 'OPEN', PENDING = 'PENDING', IN_PROGRESS = 'IN_PROGRESS', RESOLVED = 'RESOLVED', CLOSED = 'CLOSED' }
export enum TicketPriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', URGENT = 'URGENT', CRITICAL = 'CRITICAL' }
export enum TicketCategory { TECHNICAL_ISSUE = 'TECHNICAL_ISSUE', BILLING_ISSUE = 'BILLING_ISSUE', GENERAL_QUESTION = 'GENERAL_QUESTION', COMPLAINT = 'COMPLAINT', FEATURE_REQUEST = 'FEATURE_REQUEST', OTHER = 'OTHER' }
