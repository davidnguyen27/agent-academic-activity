import axiosInstance from "@/configs/axios.config";

export const authService = {
  authenticate: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/api/user/login", credentials);
    return res.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/api/user/refresh-token", { refreshToken });
    return res.data;
  },

  currentUser: async () => {
    const response = await axiosInstance.get("/api/user/current-user");
    return response.data;
  },
};
