import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { majorService } from "@/services/major.service";
import { useLoading } from "@/hooks/useLoading";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime } from "@/utils/format/date-time.format";
import ModalCreateMajor from "@/components/layouts/admin/majors/ModalCreate";
import ModalEditMajor from "@/components/layouts/admin/majors/ModalEdit";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";

const MajorManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [majors, setMajors] = useState<Major[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const fetchMajors = useCallback(async () => {
    const res = await startLoading(() =>
      majorService.getAllMajors({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        isDelete: deletedFilter,
      })
    );
    setMajors(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await majorService.getMajorById(id);
      setSelectedMajor(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load major details");
    }
  }, []);

  const handleDeleteMajor = async (id: string) => {
    try {
      await majorService.deleteMajor(id);
      toast.success("Major deleted successfully!");
      await fetchMajors();
    } catch {
      toast.error("Failed to delete major. Try again later.");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");
    if (id && (!openDetail || selectedMajor?.majorId !== id)) {
      handleOpenDetail(id);
    }
    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedMajor(null);
    }
  }, [location.search, openDetail, selectedMajor, handleOpenDetail]);

  useEffect(() => {
    fetchMajors();
  }, [fetchMajors]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      {/* Title and Breadcrumb */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Major Management</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Majors</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Filter and Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          className="flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
        />
        <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setDeletedFilter(value === "true")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Active</SelectItem>
            <SelectItem value="true">Deleted</SelectItem>
          </SelectContent>
        </Select>
        <ModalCreateMajor onSuccess={fetchMajors} />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-blue-500 animate-pulse">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : majors.length > 0 ? (
              majors.map((major, index) => (
                <TableRow key={major.majorId} className="hover:bg-gray-50 transition-all">
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{major.majorCode}</TableCell>
                  <TableCell>{major.majorName}</TableCell>
                  <TableCell>{formatDateTime(major.startAt)}</TableCell>
                  <TableCell>{formatDateTime(major.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(major.updatedAt)}</TableCell>
                  <TableCell className="flex justify-center gap-3">
                    <ConfirmDeleteDialog onConfirm={() => handleDeleteMajor(major.majorId)}>
                      <Trash2 size={18} className="text-red-500 hover:text-red-600 cursor-pointer" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={18}
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                      onClick={() => navigate(`/admin/major?id=${major.majorId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400 italic">
                  No majors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Modal Edit */}
      <ModalEditMajor
        open={openDetail}
        major={selectedMajor}
        onSuccess={fetchMajors}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) navigate("/admin/major", { replace: true });
        }}
      />
    </div>
  );
};

export default MajorManagement;
