interface Student {
  studentId: string;
  studentCode: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  dob: string;
  intakeYear: number;
  gender: string;
  majorId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  userId: string;
  user?: {
    email: string;
    isActive: boolean;
  };
}
