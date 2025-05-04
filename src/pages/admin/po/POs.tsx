import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
import { Trash2, BadgeInfo } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { formatDateTime } from "@/utils/format/date-time.format";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { poService } from "@/services/po.service";
import ModalCreatePO from "@/components/layouts/admin/POs/ModalCreate";
import ModalEditPO from "@/components/layouts/admin/POs/ModalEdit";

const POManagement = () => {
  const [pos, setPOs] = useState<PO[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const pageSize = 10;
  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();

  const fetchPOs = useCallback(async () => {
    try {
      const res = await startLoading(() =>
        poService.getAllPOs({
          pageNumber: page,
          pageSize,
          search: debouncedSearch,
          sortBy: sortBy === "default" ? undefined : sortBy,
          sortType,
          isDelete: deletedFilter,
        })
      );
      setPOs(res.items);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to fetch POs");
    }
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleDelete = async (id: string) => {
    try {
      await poService.deletePO(id);
      toast.success("PO deleted successfully!");
      await fetchPOs();
    } catch {
      toast.error("Failed to delete PO");
    }
  };

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Program Outcome (PO) Management</h1>

      <Breadcrumb className="mb-6">
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
          <BreadcrumbItem>POs</BreadcrumbItem>
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenCreateModal(true)}>
            + Add a PO
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} />
            ) : pos.length > 0 ? (
              pos.map((po, index) => (
                <TableRow key={po.programingOutcomeId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{po.programingOutcomeCode}</TableCell>
                  <TableCell>{po.programingOutcomeName}</TableCell>
                  <TableCell>{po.description}</TableCell>
                  <TableCell>{formatDateTime(po.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(po.updatedAt)}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(po.programingOutcomeId)}>
                      <Trash2 className="text-red-500 cursor-pointer hover:text-red-600" size={18} />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      className="text-blue-500 cursor-pointer hover:text-blue-600"
                      size={18}
                      onClick={() => {
                        setSelectedPO(po);
                        setOpenEditModal(true);
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

      <div className="flex justify-end mt-6">
        <Pagination>
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

      <ModalCreatePO open={openCreateModal} onOpenChange={setOpenCreateModal} onSuccess={fetchPOs} />
      <ModalEditPO
        open={openEditModal}
        po={selectedPO}
        onSuccess={fetchPOs}
        onOpenChange={(open) => {
          setOpenEditModal(open);
          if (!open) setSelectedPO(null);
        }}
      />
    </div>
  );
};

export default POManagement;
