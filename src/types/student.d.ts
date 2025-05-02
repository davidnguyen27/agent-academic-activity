interface User {
  userId?: string;
  fullName: string;
  studentCode?: string;
  majorName?: string;
  majorId?: string;
  gender?: string;
  dob?: string;
  address?: string;
  phoneNumber?: string;
  intakeYear?: string;
  email: string;
  isActive?: boolean;
  role?: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiredRefreshToken?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}
