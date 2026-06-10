import { api } from "@/utils/api";
import type {
  LoginRequest,
  LoginResponse,
  UpdateAdminRequest,
  UpdateAdminResponse,
  RegisterRequest,
  RegisterResponse,
  Admin,
} from "../types";

export const authApi = {
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", credentials as any),

  register: (credentials: RegisterRequest) =>
    api.post<RegisterResponse>("/auth/register", credentials as any),

  logout: () => api.post<{ message: string }>("/auth/logout"),

  getMe: () => api.get<Admin>("/auth/me"),

  updateProfile: (data: UpdateAdminRequest) =>
    api.patch<UpdateAdminResponse>("/auth/me", data as any),
};
