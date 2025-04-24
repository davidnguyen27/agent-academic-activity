interface Params {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "name" | "code" | "default";
  sortType?: "Ascending" | "Descending";
  isDelete?: boolean;
}
