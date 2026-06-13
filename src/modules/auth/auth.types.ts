export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}