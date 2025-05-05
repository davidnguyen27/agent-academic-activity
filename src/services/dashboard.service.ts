import axiosInstance from "@/configs/axios.config";

export const dashboardService = {
  adminReport: async () => {
    const response = await axiosInstance.get("/api/admins/report");
    return response;
  },
};
