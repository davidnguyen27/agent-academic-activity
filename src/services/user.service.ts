import axiosInstance from "@/configs/axios.config";

export const userService = {
  updateStudent: async (data: {
    fullName: string;
    address: string;
    phoneNumber: string;
    dob: string;
    intakeYear: string;
    gender: string;
    majorId?: string;
  }) => {
    const response = await axiosInstance.put("/api/students/myself", data);
    return response.data;
  },
};
