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
import { materialService } from "@/services/material.service";
import { subjectService } from "@/services/subject.service";
import { useLoading } from "@/hooks/useLoading";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime } from "@/utils/format/date-time.format";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";

const MaterialManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const fetchMaterials = useCallback(async () => {
    const res = await startLoading(() =>
      materialService.getAllMaterials({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setMaterials(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await materialService.getMaterialById(id);
      setSelectedMaterial(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load material details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await materialService.deleteMaterial(id);
      toast.success("Material deleted successfully!");
      await fetchMaterials();
    } catch {
      toast.error("Failed to delete material. Try again later!");
    }
  };

  const subjectMap = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((m) => map.set(m.subjectId, m.subjectName));
    return map;
  }, [subjects]);

  useEffect(() => {
    subjectService.getAllSubjects({ pageSize: 1000 }).then((res) => {
      setSubjects(res.items);
    });
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedMaterial?.materialId !== id)) {
      handleOpenDetail(id);
    }

    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedMaterial(null);
    }
  }, [location.search, openDetail, selectedMaterial, handleOpenDetail]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return (
    <div className="bg-white p-6 shadow-md rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800">Material Management</h1>

      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Materials</BreadcrumbItem>
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

        <div className="ml-auto flex">
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/admin/material/create")}
          >
            + Add a Material
          </Button>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={10} />
            ) : materials.length > 0 ? (
              materials.map((material, index) => (
                <TableRow key={material.materialId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{material.materialCode}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{material.materialName}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{material.publisher}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{material.author}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{formatDateTime(material.publishedDate)}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{subjectMap.get(material.subjectId)}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{formatDateTime(material.createdAt)}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{formatDateTime(material.updatedAt)}</TableCell>
                  <TableCell className="flex gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(material.materialId)}>
                      <Trash2 size={16} color="red" className="cursor-pointer" />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={16}
                      color="blue"
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/material/details?id=${material.materialId}`);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10}>
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
    </div>
  );
};

export default MaterialManagement;
