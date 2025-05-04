interface User {
  userId: string;
  email: string;
  isActive: true;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}
