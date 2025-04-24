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

const ToolManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tools, setTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
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
        isDelete: deletedFilter,
      })
    );
    setTools(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, deletedFilter]);

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
    <div className="bg-white p-5 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Tool Management</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Tools</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." />
        <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="code">Sort by Code</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setDeletedFilter(value === "true")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Active or Deleted" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Deleted</SelectItem>
          </SelectContent>
        </Select>
        <ToolCreateDialog onSuccess={fetchTools} />
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
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
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <span className="text-blue-500 animate-pulse">Loading...</span>
                </TableCell>
              </TableRow>
            ) : tools.length > 0 ? (
              tools.map((tool, i) => (
                <TableRow key={tool.toolCode}>
                  <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell>{tool.toolCode}</TableCell>
                  <TableCell>{tool.toolName}</TableCell>
                  <TableCell>{tool.description}</TableCell>
                  <TableCell>{formatDateTime(tool.publishedDate)}</TableCell>
                  <TableCell>{tool.author}</TableCell>
                  <TableCell>{tool.publisher}</TableCell>
                  <TableCell>{tool.note}</TableCell>
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
                <TableCell colSpan={9} className="text-center text-gray-400">
                  Result is not found.
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
