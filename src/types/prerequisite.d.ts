interface Prerequisite {
  prerequisiteConstraintId: string;
  prerequisiteConstraintCode: string;
  groupCombinationType: string;
  subjectId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}
