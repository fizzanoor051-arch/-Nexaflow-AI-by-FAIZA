
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost"
  | "inactive";

export type LeadPriority = "low" | "medium" | "high";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: LeadStatus;
  priority: LeadPriority;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  notes?: string;
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  notes?: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}
