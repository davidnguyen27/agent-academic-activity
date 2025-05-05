import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BadgeInfo, Trash2 } from "lucide-react";
import ToolCreateDialog from "@/components/layouts/admin/tools/ModalCreate";
import ToolEditDialog from "@/components/layouts/admin/tools/ModalEdit";
import { toolService } from "@/services/tool.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { formatDateTime } from "@/utils/format/date-time.format";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";

const ToolManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const pageSize = 10;
  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();

  const fetchTools = useCallback(async () => {
    const res = await startLoading(() =>
      toolService.getAllTools({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setTools(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await toolService.getToolById(id);
      setSelectedTool(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load tool details");
    }
  }, []);

  const handleDeleteTool = async (id: string) => {
    try {
      await toolService.deleteTool(id);
      toast.success("Tool deleted successfully!");
      await fetchTools();
    } catch {
      toast.error("Failed to delete tool. Try again later.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("toolId");

    if (id && (!openDetail || selectedTool?.toolId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedTool(null);
    }
  }, [location.search, openDetail, selectedTool, handleOpenDetail]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  return (
    <div className="bg-white p-6 shadow-md rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800">Tool Management</h1>

      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Tools</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-end justify-between gap-4 bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code..."
            className="w-60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Sort By</label>
          <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")} defaultValue="default">
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Sort Type</label>
          <Select onValueChange={(value) => setSortType(value as "Ascending" | "Descending")} defaultValue="Ascending">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ascending">Ascending</SelectItem>
              <SelectItem value="Descending">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status</label>
          <Select onValueChange={(value) => setDeletedFilter(value === "true")} defaultValue="false">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Active</SelectItem>
              <SelectItem value="true">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <ToolCreateDialog onSuccess={fetchTools} />
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={9} />
            ) : tools.length > 0 ? (
              tools.map((tool, i) => (
                <TableRow key={tool.toolCode}>
                  <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{tool.toolCode}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{tool.toolName}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{tool.description}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{formatDateTime(tool.publishedDate)}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{tool.author}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{tool.publisher}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{tool.note}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDeleteTool(tool.toolId)}>
                      <Trash2 size={16} color="red" className="cursor-pointer" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={16}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/tool?toolId=${tool.toolId}`);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptySearchResult />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-8">
        <Pagination className="ml-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(p - 1, 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ToolEditDialog
        open={openDetail}
        tool={selectedTool}
        onSuccess={fetchTools}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) {
            navigate("/admin/tool", { replace: true });
          }
        }}
      />
    </div>
  );
};

export default ToolManagement;
