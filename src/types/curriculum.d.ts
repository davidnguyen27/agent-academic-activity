interface Curriculum {
  curriculumId: string;
  curriculumCode: string;
  curriculumName: string;
  description?: string;
  decisionNo: string;
  preRequisite?: string;
  isActive: boolean;
  isApproved: boolean;
  majorId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDelete?: boolean;
}
