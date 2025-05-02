import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { curriculumService } from "@/services/curriculum.service";
import { majorService } from "@/services/major.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { Badge } from "@/components/ui/badge";

const CurriculumManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const majorMap = useMemo(() => {
    const map = new Map<string, string>();
    majors.forEach((m) => map.set(m.majorId, m.majorName));
    return map;
  }, [majors]);

  useEffect(() => {
    majorService.getAllMajors({ pageSize: 1000 }).then((res) => {
      setMajors(res.items);
    });
  }, []);

  const fetchCurriculums = useCallback(async () => {
    const res = await startLoading(() =>
      curriculumService.getAllCurriculums({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        isDelete: deletedFilter,
      })
    );
    setCurriculums(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await curriculumService.getCurriculumById(id);
      setSelectedCurriculum(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load curriculum details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await curriculumService.deleteCurriculum(id);
      toast.success("Curriculum deleted successfully!");
      await fetchCurriculums();
    } catch {
      toast.error("Failed to delete curriculum");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedCurriculum?.curriculumId !== id)) {
      handleOpenDetail(id);
    }
    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedCurriculum(null);
    }
  }, [location.search, openDetail, selectedCurriculum, handleOpenDetail]);

  useEffect(() => {
    fetchCurriculums();
  }, [fetchCurriculums]);

  return (
    <div className="bg-white p-8 shadow-md rounded-2xl">
      {/* Title + Breadcrumb */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Curriculum Management</h1>
        <Breadcrumb>
          <BreadcrumbList className="text-gray-500 text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Curriculums</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search curriculum by name..."
          className="flex-1 min-w-[200px]"
        />
        <Select onValueChange={(value) => setSortBy(value as "code" | "name" | "default")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by field" />
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
        <Button
          onClick={() => navigate("/admin/curriculum/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Add a Curriculum
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-center">#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Decision No</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : curriculums.length > 0 ? (
              curriculums.map((curriculum, index) => (
                <TableRow key={curriculum.curriculumId} className="hover:bg-gray-50 transition-all">
                  <TableCell className="text-center">{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell className="truncate max-w-[100px]" title={curriculum.curriculumCode}>
                    {curriculum.curriculumCode}
                  </TableCell>
                  <TableCell className="truncate max-w-[250px]" title={curriculum.curriculumName}>
                    {curriculum.curriculumName}
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]" title={curriculum.decisionNo}>
                    {curriculum.decisionNo}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]" title={majorMap.get(curriculum.majorId) ?? "-"}>
                    {majorMap.get(curriculum.majorId)}
                  </TableCell>
                  <TableCell className="max-w-[50px]">
                    {curriculum.isApproved ? (
                      <Badge variant="outline" className="text-green-600 border-green-500">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-500">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-center gap-3">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(curriculum.curriculumId)}>
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform cursor-pointer"
                      />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={18}
                      className="text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => navigate(`/admin/curriculum/details?id=${curriculum.curriculumId}`)}
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
      <div className="flex justify-end mt-6 pt-4">
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
    </div>
  );
};

export default CurriculumManagement;
