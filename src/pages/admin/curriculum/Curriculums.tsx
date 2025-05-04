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
import { BadgeInfo, Maximize2, Trash2 } from "lucide-react";
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
import { programService } from "@/services/program.service";
import ModalMajorDetail from "@/components/layouts/admin/majors/ModalDetail";
import ModalProgramDetail from "@/components/layouts/admin/programs/ModalDetail";

const CurriculumManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [openMajor, setOpenMajor] = useState(false);
  const [openProgram, setOpenProgram] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

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

  const fetchCurriculums = useCallback(async () => {
    const res = await startLoading(() =>
      curriculumService.getAllCurriculums({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setCurriculums(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

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
    <div className="bg-white p-6 shadow-md rounded-2xl">
      {/* Title + Breadcrumb */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Curriculum Management</h1>
        <Breadcrumb className="my-6">
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
            onClick={() => navigate("/admin/curriculum/create")}
          >
            + Add a Curriculum
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-center">#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Decision No</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Program</TableHead>
              <TableHead className="text-center">Approved</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={8} />
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
                  <TableCell
                    className="truncate max-w-[100px] cursor-pointer text-blue-600 hover:underline"
                    title={majorMap.get(curriculum.majorId) ?? "-"}
                    onClick={() => {
                      const major = majors.find((m) => m.majorId === curriculum.majorId);
                      if (major) {
                        setSelectedMajor(major);
                        setOpenMajor(true);
                      }
                    }}
                  >
                    {majorMap.get(curriculum.majorId)}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[100px] cursor-pointer text-blue-600 hover:underline"
                    title={programMap.get(curriculum.programId) ?? "-"}
                    onClick={() => {
                      const program = programs.find((p) => p.programId === curriculum.programId);
                      if (program) {
                        setSelectedProgram(program);
                        setOpenProgram(true);
                      }
                    }}
                  >
                    {programMap.get(curriculum.programId)}
                  </TableCell>
                  <TableCell className="max-w-[50px] text-center">
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
                    <Maximize2
                      size={18}
                      className="text-gray-500 hover:text-blue-600 hover:scale-110 cursor-pointer transition-transform"
                      onClick={() => {
                        navigate(`/admin/curriculum/overview?id=${curriculum.curriculumId}`);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
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

      <ModalMajorDetail open={openMajor} onClose={() => setOpenMajor(false)} major={selectedMajor} />
      <ModalProgramDetail open={openProgram} onClose={() => setOpenProgram(false)} program={selectedProgram} />
    </div>
  );
};

export default CurriculumManagement;
