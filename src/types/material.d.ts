interface Material {
  materialId: string;
  materialCode: string;
  materialName: string;
  materialDescription: string;
  author: string;
  publisher: string;
  publishedDate: string;
  edition: string;
  isbn: string;
  isMainMaterial: boolean;
  isHardCopy: boolean;
  isOnline: boolean;
  note: string;
  subjectId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleted?: boolean;
}
