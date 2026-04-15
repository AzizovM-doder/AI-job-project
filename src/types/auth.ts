// Real API response shape from /Auth/login — flat object, no wrapper
export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: 'Candidate' | 'Organization';
}

// Decoded JWT payload shape
export interface JwtPayload {
  UserId: string;
  email: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
}

export type UserRole = 'Candidate' | 'Organization';
