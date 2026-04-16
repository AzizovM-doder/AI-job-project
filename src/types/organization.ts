export enum OrganizationType {
  Startup = 'Startup',
  Company = 'Company',
  Agency = 'Agency'
}

export enum OrganizationMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member',
  Recruiter = 'Recruiter'
}

export interface Organization {
  id: number;
  name: string | null;
  description: string | null;
  type: OrganizationType;
  location: string | null;
  logoUrl: string | null;
}

export interface OrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  role: string | null;
}

export interface MemberDirectoryEntryDto {
  id: number;
  fullName: string | null;
  userName: string | null;
  email: string | null;
  role: string | null;
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

// DTOs for Mutations
export interface CreateOrganizationDto {
  name: string | null;
  description: string | null;
  type: string | null;
  location: string | null;
  logoUrl: string | null;
}

export interface UpdateOrganizationDto {
  id: number;
  name: string | null;
  description: string | null;
  type: string | null;
  location: string | null;
  logoUrl: string | null;
}

export interface CreateOrganizationMemberDto {
  organizationId: number;
  userId: number;
  role: string | null;
}

export interface UpdateOrganizationMemberDto {
  id: number;
  organizationId: number;
  userId: number;
  role: string | null;
}

export interface OrganizationMemberInviteRespondDto {
  isAccepted: boolean;
}
