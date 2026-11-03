export type UserRole = 'admin' | 'seller' | 'goldsmith';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
