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

export interface Session {
  user: {
    full_name: string;
    email: string;
    accessToken?: string;
  };
}

// User interface moved from lib/providers/auth-provider.tsx
export interface User {
    id: string;
    email: string;
    full_name: string;
    role: string[];
    accessToken: string;
}

// AuthContextType interface moved from lib/providers/auth-provider.tsx
export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLogged: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getUser: () => Promise<User | null>;
}
