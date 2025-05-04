import { useCallback, useEffect, useMemo, useState } from "react";
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
import { comboService } from "@/services/combo.service";
import { useLoading } from "@/hooks/useLoading";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime } from "@/utils/format/date-time.format";
import ModalCreateCombo from "@/components/layouts/admin/combos/ModalCreate";
import ModalEditCombo from "@/components/layouts/admin/combos/ModalEdit";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { programService } from "@/services/program.service";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";

const ComboManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [combos, setCombos] = useState<Combo[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const fetchCombos = useCallback(async () => {
    const res = await startLoading(() =>
      comboService.getAllCombos({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setCombos(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await comboService.getComboById(id);
      setSelectedCombo(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load combo details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await comboService.deleteCombo(id);
      toast.success("Combo deleted successfully!");
      await fetchCombos();
    } catch {
      toast.error("Failed to delete combo. Try again later!");
    }
  };

  const programMap = useMemo(() => {
    const map = new Map<string, string>();
    programs.forEach((p) => map.set(p.programId, p.programName));
    return map;
  }, [programs]);

  useEffect(() => {
    programService.getAllPrograms({ pageSize: 1000 }).then((res) => {
      setPrograms(res.items);
    });
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedCombo?.comboId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedCombo(null);
    }
  }, [location.search, openDetail, selectedCombo, handleOpenDetail]);

  useEffect(() => {
    fetchCombos();
  }, [fetchCombos]);

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800">Combo Management</h1>

      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/program">Programs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Combos</BreadcrumbItem>
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

        <div className="ml-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenCreateModal(true)}>
            + Add a Combo
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} />
            ) : combos.length > 0 ? (
              combos.map((combo, index) => (
                <TableRow key={combo.comboId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{combo.comboCode}</TableCell>
                  <TableCell>{combo.comboName}</TableCell>
                  <TableCell>{programMap.get(combo.programId)}</TableCell>
                  <TableCell>{formatDateTime(combo.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(combo.updatedAt)}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(combo.comboId)}>
                      <Trash2 size={16} color="red" className="cursor-pointer" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={16}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/program/combo-list?id=${combo.comboId}`);
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

      <ModalCreateCombo open={openCreateModal} onOpenChange={setOpenCreateModal} onSuccess={fetchCombos} />
      <ModalEditCombo
        open={openDetail}
        combo={selectedCombo}
        onSuccess={fetchCombos}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) {
            navigate("/admin/program/combo-list", { replace: true });
          }
        }}
      />
    </div>
  );
};

export default ComboManagement;
