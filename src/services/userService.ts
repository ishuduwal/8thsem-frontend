import API_BASE_URL from "../config/api";

export interface User {
  phoneNumber: string;
  fullName: string;
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  email: string;
  success: boolean;
}

export interface PasswordResetVerify {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}
export interface UserListResponse {
  users: User[];
}
export interface AdminStatusUpdate {
  isAdmin: boolean;
}

class UserService {
  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  async refreshToken(refreshTokenData: RefreshTokenData): Promise<{ accessToken: string }> {
    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refreshTokenData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token refresh failed');
    }

    return response.json();
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<PasswordResetResponse> {
    const response = await fetch(`${API_BASE_URL}/users/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }

    return response.json();
  }

  async verifyOTP(data: OTPVerifyRequest): Promise<{ message: string; verified: boolean }> {
    const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'OTP verification failed');
    }

    return response.json();
  }

  async verifyOTPAndResetPassword(data: PasswordResetVerify): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/verify-otp-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
  }

  async resendOTP(data: ResendOTPRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Resend OTP failed');
    }

    return response.json();
  }

  async getAllUsers(): Promise<UserListResponse> {
    const response = await fetch(`${API_BASE_URL}/users/users-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }

    return response.json();
  }

  async updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/users-list/${userId}/admin-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ isAdmin }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user admin status');
    }

    return response.json();
  }
}

export default new UserService();