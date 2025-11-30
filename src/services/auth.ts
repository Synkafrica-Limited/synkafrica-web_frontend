import authService from './authService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authServiceWrapper = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authService.signIn(credentials.email, credentials.password);
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: response.user
    };
  },

  async refreshToken(): Promise<AuthResponse> {
    // TODO: Implement refresh token logic
    throw new Error('Refresh token not implemented');
  },

  logout(): void {
    authService.signOut();
  },

  getStoredToken(): string | null {
    return authService.getAccessToken();
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};