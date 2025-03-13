export interface UserSession {
  user_id: string;
  email: string;
  role: string;
  expires: Date;
}

export interface AuthConfig {
  tokenExpiry: number;
  refreshTokenExpiry: number;
}
