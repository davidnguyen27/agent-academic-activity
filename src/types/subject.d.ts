interface Subject {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  decisionNo: string;
  isActive: boolean;
  isApproved: boolean;
  noCredit: number;
  approvedDate: string;
  curriculumId: string;
  sessionNo: number;
  syllabusName: string;
  degreeLevel: string;
  timeAllocation: string;
  description: string;
  studentTasks: string;
  scoringScale: number;
  minAvgMarkToPass: number;
  note: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDelete?: boolean;
}
