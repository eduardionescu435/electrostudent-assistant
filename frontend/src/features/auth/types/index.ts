export interface Admin {
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  username: string;
}

export interface UpdateAdminRequest {
  username?: string;
  password?: string;
}

export interface UpdateAdminResponse {
  message: string;
  username: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
}

export interface ApiError {
  message: string;
}
