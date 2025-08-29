export interface IUser {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}