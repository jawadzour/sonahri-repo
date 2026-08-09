import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/api";
import type { AdminUser } from "@/types/models";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  user: AdminUser;
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiSuccess<LoginResponseData>>("/auth/login", payload);
    return data.data;
  },

  async me() {
    const { data } = await api.get<ApiSuccess<AdminUser>>("/auth/me");
    return data.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },

  async forgotPassword(email: string) {
    const { data } = await api.post<ApiSuccess<null>>("/auth/forgot-password", { email });
    return data.message || "If an account exists for that email, a reset link has been sent.";
  },

  async resetPassword(token: string, password: string) {
    const { data } = await api.post<ApiSuccess<null>>("/auth/reset-password", { token, password });
    return data.message || "Your password has been reset.";
  },

  async signup(payload: { name: string; email: string; password: string }) {
    const { data } = await api.post<ApiSuccess<null>>("/auth/signup", payload);
    return data.message || "Account created. Waiting for admin approval.";
  },
};