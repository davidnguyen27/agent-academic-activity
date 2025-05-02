import axiosInstance from "@/configs/axios.config";

export const authService = {
  authenticate: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/api/authenticate/login", credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/api/authenticate/refresh-token", { refreshToken });
    return response.data;
  },

  loginGoogle: async ({ token }: { token: string }) => {
    const response = await axiosInstance.post("/api/authenticate/google-login", { token });
    return response.data;
  },

  currentUser: async () => {
    const response = await axiosInstance.get("/api/user/current");
    return response.data;
  },
};
