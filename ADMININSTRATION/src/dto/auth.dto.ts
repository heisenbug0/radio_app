export interface LoginDto {
  email: string;
  password: string;
}

export interface EmailDto {
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}
