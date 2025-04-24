import axiosInstance from "@/configs/axios.config";
import { ComboInput } from "@/utils/validate/combo.schema";

export const comboService = {
  createCombo: async (data: ComboInput) => {
    const response = await axiosInstance.post("/api/combo/create-combo", data);
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
    const response = await axiosInstance.get("/api/combo/get-all-combos", {
      params: { pageNumber, pageSize, search, sortBy, sortType, isDelete },
    });
    return response.data;
  },

  getComboById: async (id: string) => {
    const response = await axiosInstance.get(`/api/combo/get-combo-by-id/${id}`);
    return response.data;
  },

  updateCombo: async (id: string, data: ComboInput) => {
    const response = await axiosInstance.put(`/api/combo/update-combo/${id}`, data);
    return response.data;
  },

  deleteCombo: async (id: string) => {
    const response = await axiosInstance.delete(`/api/combo/delete-combo/${id}`);
    return response.data;
  },
};
