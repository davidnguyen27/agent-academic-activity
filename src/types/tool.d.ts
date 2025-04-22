interface Tool {
  toolId: string;
  toolCode: string;
  toolName: string;
  description: string;
  author: string;
  publisher: string;
  publishedDate: string;
  note: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}
