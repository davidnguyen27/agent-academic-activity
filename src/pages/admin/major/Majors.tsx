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
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { Button } from "@/components/ui/button";

const MajorManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [majors, setMajors] = useState<Major[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
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
        sortType,
        isDelete: deletedFilter,
      })
    );
    setMajors(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

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
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Title and Breadcrumb */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Major Management</h1>
        <Breadcrumb className="my-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/curriculum">Curriculums</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Majors</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Filter and Actions */}
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
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setOpenCreateModal(true)}
          >
            + Add a Curriculum
          </Button>
        </div>
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
              <TableSkeleton columns={7} />
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
                      onClick={() => navigate(`/admin/curriculum/major?id=${major.majorId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptySearchResult />
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

      <ModalCreateMajor open={openCreateModal} onOpenChange={setOpenCreateModal} onSuccess={fetchMajors} />
      <ModalEditMajor
        open={openDetail}
        major={selectedMajor}
        onSuccess={fetchMajors}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) navigate("/admin/curriculum/major", { replace: true });
        }}
      />
    </div>
  );
};

export default MajorManagement;
