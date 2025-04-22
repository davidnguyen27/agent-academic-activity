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
import ToolCreateDialog from "@/components/layouts/admin/ModalCreate";
import ToolEditDialog from "@/components/layouts/admin/ModalEdit";
import { toolService } from "@/services/tool.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { formatDate } from "@/utils/format/date.format";
import { toast } from "sonner";

const ToolManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [tools, setTools] = useState<Tool[]>([]);
  const [sortedTools, setSortedTools] = useState<Tool[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const pageSize = 10;
  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();

  const fetchTools = useCallback(async () => {
    const res = await startLoading(() =>
      toolService.getAllTools({
        pageNumber: page,
        pageSize: 10,
        search: debouncedSearch,
      })
    );
    setTools(res.items);
    setTotalPages(res.totalPages);
  }, [page, debouncedSearch, startLoading]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  useEffect(() => {
    const sorted = [...tools];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => a.toolCode.localeCompare(b.toolCode));
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => b.toolCode.localeCompare(a.toolCode));
    }
    setSortedTools(sorted);
  }, [tools, sortOrder]);

  const handleOpenDetail = useCallback(
    async (id: string) => {
      navigate(`/admin/tool?toolId=${id}`);
      const data = await toolService.getToolById(id);
      setSelectedTool(data);
      setOpenDetail(true);
    },
    [navigate]
  );

  const handleDeleteTool = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this tool?");
    if (!confirmed) return;

    try {
      await toolService.deleteTool(id);
      toast.success("Tool deleted successfully!");
      await fetchTools();
    } catch {
      toast.error("Failed to delete tool. Try again later.");
    }
  };

  useEffect(() => {
    const id = searchParams.get("toolId");
    if (id) {
      handleOpenDetail(id);
    }
  }, [searchParams, handleOpenDetail]);

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
        <Select onValueChange={(value) => setSortOrder(value as "asc" | "desc" | "none")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">-- Default --</SelectItem>
            <SelectItem value="asc">Sort ascending by code</SelectItem>
            <SelectItem value="desc">Sort descending by code</SelectItem>
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
            ) : Array.isArray(sortedTools) && sortedTools.length > 0 ? (
              sortedTools.map((tool, i) => (
                <TableRow key={tool.toolCode}>
                  <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell>{tool.toolCode}</TableCell>
                  <TableCell>{tool.toolName}</TableCell>
                  <TableCell>{tool.description}</TableCell>
                  <TableCell>{formatDate(tool.publishedDate)}</TableCell>
                  <TableCell>{tool.author}</TableCell>
                  <TableCell>{tool.publisher}</TableCell>
                  <TableCell>{tool.note}</TableCell>
                  <TableCell className="flex gap-2">
                    <Trash2
                      size={16}
                      color="red"
                      className="cursor-pointer"
                      onClick={() => handleDeleteTool(tool.toolId)}
                    />
                    <BadgeInfo
                      size={16}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => handleOpenDetail(tool.toolId)}
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

      <div className="flex mt-8">
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

      <ToolEditDialog open={openDetail} tool={selectedTool} onOpenChange={setOpenDetail} onSuccess={fetchTools} />
    </div>
  );
};

export default ToolManagement;
