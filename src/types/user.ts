export enum UserRole {
  Candidate = 'Candidate',
  Organization = 'Organization',
  Admin = 'Admin'
}

export interface User {
  id: number;
  userName: string | null;
  normalizedUserName: string | null;
  email: string | null;
  normalizedEmail: string | null;
  emailConfirmed: boolean;
  fullName: string | null;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string | null;
  lockoutEnabled?: boolean;
}

export interface UserPublicProfileDto {
  userId: number;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  title?: string | null;
  avatarUrl?: string | null;
}

export interface UserSettingsDto {
  theme: string | null;
  brandColor: string | null;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string | null;
}

export interface UpdateUserSettingsDto {
  theme: string | null;
  brandColor: string | null;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string | null;
}

export interface ProfileStatusResponse {
  statusCode: number;
  description: string[] | null;
  data: boolean;
}
