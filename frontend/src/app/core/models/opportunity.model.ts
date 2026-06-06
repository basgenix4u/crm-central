import { User } from './user.model';
import { Customer } from './customer.model';

export interface Opportunity {
  id: string;
  name: string;
  description?: string;
  stage: OpportunityStage;
  amount?: number;
  probability?: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  type?: string;
  source?: string;
  nextStep?: string;
  customer?: Customer;
  assignedTo?: User;
  createdAt: string;
}

export enum OpportunityStage {
  PROSPECT = 'PROSPECT', QUALIFIED = 'QUALIFIED', PROPOSAL_SENT = 'PROPOSAL_SENT',
  NEGOTIATION = 'NEGOTIATION', WON = 'WON', LOST = 'LOST'
}
