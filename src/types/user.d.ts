interface User {
  userId: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  role: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiredRefreshToken: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
}
