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
import { formatDate } from "@/utils/format/date.format";
import ModalCreateMajor from "@/components/layouts/admin/majors/ModalCreate";
import ModalEditMajor from "@/components/layouts/admin/majors/ModalEdit";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/majors/ModalConfirm";

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
    <div className="bg-white p-5 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Major Management</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Majors</BreadcrumbLink>
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

        <ModalCreateMajor onSuccess={fetchMajors} />
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-blue-500 animate-pulse">
                  Loading...
                </TableCell>
              </TableRow>
            ) : majors.length > 0 ? (
              majors.map((major, i) => (
                <TableRow key={major.majorId}>
                  <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell>{major.majorCode}</TableCell>
                  <TableCell>{major.majorName}</TableCell>
                  <TableCell>{formatDate(major.createdAt || "")}</TableCell>
                  <TableCell>{formatDate(major.updatedAt || "")}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDeleteMajor(major.majorId)}>
                      <Trash2 size={16} color="red" className="cursor-pointer" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={16}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/major?id=${major.majorId}`);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400">
                  No majors found.
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
      <ModalEditMajor
        open={openDetail}
        major={selectedMajor}
        onSuccess={fetchMajors}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) {
            navigate("/admin/major", { replace: true });
          }
        }}
      />
    </div>
  );
};

export default MajorManagement;
