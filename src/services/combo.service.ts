import axiosInstance from "@/configs/axios.config";
import { ComboInput } from "@/utils/validate/combo.schema";

export const comboService = {
  createCombo: async (data: ComboInput) => {
    const response = await axiosInstance.post("/api/combos/", data);
    return response.data;
  },

  getAllCombos: async ({
    pageNumber = 1,
    pageSize = 10,
    search = "",
    sortBy = "code",
    sortType = "Ascending",
    isDelete = false,
  }: Params) => {
    const response = await axiosInstance.get("/api/combos/", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getComboById: async (id: string) => {
    const response = await axiosInstance.get(`/api/combos/${id}`);
    return response.data;
  },

  updateCombo: async (id: string, data: ComboInput) => {
    const response = await axiosInstance.put(`/api/combos/${id}`, data);
    return response.data;
  },

  deleteCombo: async (id: string) => {
    const response = await axiosInstance.delete(`/api/combos/${id}`);
    return response.data;
  },
};
