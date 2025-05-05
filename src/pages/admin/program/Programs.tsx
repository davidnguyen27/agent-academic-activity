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
import ProgramCreateDialog from "@/components/layouts/admin/programs/ModalCreate";
import ProgramEditDialog from "@/components/layouts/admin/programs/ModalEdit";
import { programService } from "@/services/program.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { formatDateTime } from "@/utils/format/date-time.format";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";

const ProgramManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const pageSize = 10;
  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();

  const fetchPrograms = useCallback(async () => {
    const res = await startLoading(() =>
      programService.getAllPrograms({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setPrograms(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await programService.getProgramById(id);
      setSelectedProgram(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load program details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await programService.deleteProgram(id);
      toast.success("Program deleted successfully!");
      await fetchPrograms();
    } catch {
      toast.error("Failed to delete Program. Try again later.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    if (id && (!openDetail || selectedProgram?.programId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedProgram(null);
    }
  }, [location.search, openDetail, selectedProgram, handleOpenDetail]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800">Program Management</h1>

      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Programs</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-end justify-between gap-4 bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Search</label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
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

        <div className="ml-auto flex gap-3">
          <Button variant="outline" onClick={() => navigate("/admin/program/po-list")}>
            PO Overview
          </Button>

          <Button variant="outline" onClick={() => navigate("/admin/program/combo-list")}>
            Combo Overview
          </Button>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenCreateModal(true)}>
            + Add a Program
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Start At</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} />
            ) : programs.length > 0 ? (
              programs.map((program, i) => (
                <TableRow key={program.programCode}>
                  <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell>{program.programCode}</TableCell>
                  <TableCell>{program.programName}</TableCell>
                  <TableCell>{formatDateTime(program.startAt)}</TableCell>
                  <TableCell>{formatDateTime(program.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(program.updatedAt)}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(program.programId)}>
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform cursor-pointer"
                      />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={18}
                      className="text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/program?id=${program.programId}`);
                      }}
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

      <ProgramCreateDialog
        open={openCreateModal}
        onOpenChange={(open) => setOpenCreateModal(open)}
        onSuccess={() => {
          setOpenCreateModal(false);
          fetchPrograms();
        }}
      />

      <ProgramEditDialog
        open={openDetail}
        program={selectedProgram}
        onSuccess={fetchPrograms}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) {
            navigate("/admin/program", { replace: true });
          }
        }}
      />
    </div>
  );
};

export default ProgramManagement;
