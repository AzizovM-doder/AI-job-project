export interface Organization {
  id: number;
  userId: number;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export enum OrganizationMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member',
  Recruiter = 'Recruiter'
}

export interface OrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  role: OrganizationMemberRole;
  fullName?: string;
  email?: string;
  joinedAt?: string;
  invitedAt?: string;
  status?: string;
}

export interface CreateOrganizationMemberDto {
  organizationId: number;
  email: string;
  role: OrganizationMemberRole;
}

export interface UpdateOrganizationMemberDto {
  role: OrganizationMemberRole;
}

export interface OrganizationPagedResult {
  items: Organization[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
