interface Program {
  programId: string;
  programCode: string;
  programName: string;
  startAt: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}
