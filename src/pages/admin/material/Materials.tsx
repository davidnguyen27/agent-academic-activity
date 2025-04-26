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

const MaterialManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
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
        isDelete: deletedFilter,
      })
    );
    setMaterials(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, deletedFilter]);

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
    <div className="bg-white p-5 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Material Management</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Materials</BreadcrumbLink>
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

        <Button onClick={() => navigate("/admin/material/create")}>Add a Material</Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
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
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <span className="text-blue-500 animate-pulse">Loading...</span>
                </TableCell>
              </TableRow>
            ) : materials.length > 0 ? (
              materials.map((material, index) => (
                <TableRow key={material.materialId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{material.materialCode}</TableCell>
                  <TableCell>{material.materialName}</TableCell>
                  <TableCell>{material.publisher}</TableCell>
                  <TableCell>{material.author}</TableCell>
                  <TableCell>{formatDateTime(material.publishedDate)}</TableCell>
                  <TableCell>{subjectMap.get(material.subjectId)}</TableCell>
                  <TableCell>{formatDateTime(material.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(material.updatedAt)}</TableCell>
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
                <TableCell colSpan={6} className="text-center text-gray-400">
                  No material found.
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
