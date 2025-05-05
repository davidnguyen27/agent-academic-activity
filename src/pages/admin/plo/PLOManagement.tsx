import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { curriculumService } from "@/services/curriculum.service";
import { ploService } from "@/services/plo.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { formatDateTime } from "@/utils/format/date-time.format";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import ModalCurriculumDetail from "@/components/layouts/admin/curriculums/ModalDetail";
import ModalCreatePLO from "@/components/layouts/admin/plos/ModalCreate";

const PLOManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [plos, setPLOs] = useState<PLO[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [selectedPLO, setSelectedPLO] = useState<PLO | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openCurriculum, setOpenCurriculum] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

  const curriculumMap = useMemo(() => {
    const map = new Map<string, string>();
    curriculums.forEach((c) => map.set(c.curriculumId, c.curriculumName));
    return map;
  }, [curriculums]);

  useEffect(() => {
    curriculumService.getAllCurriculums({ pageSize: 1000 }).then((res) => {
      setCurriculums(res.items);
    });
  }, []);

  const fetchPLOs = useCallback(async () => {
    const res = await startLoading(() =>
      ploService.getAllPLOs({
        pageNumber: page,
        pageSize,
        search: debouncedSearch,
        sortBy: sortBy === "default" ? undefined : sortBy,
        sortType,
        isDelete: deletedFilter,
      })
    );
    setPLOs(res.items);
    setTotalPages(res.totalPages);
  }, [page, pageSize, debouncedSearch, startLoading, sortBy, sortType, deletedFilter]);

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await ploService.getPLOById(id);
      setSelectedPLO(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load PLO details");
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await ploService.deletePLO(id);
      toast.success("PLO deleted successfully!");
      await fetchPLOs();
    } catch {
      toast.error("Failed to delete PLO");
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedPLO?.programingLearningOutcomeId !== id)) {
      handleOpenDetail(id);
    }
    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedCurriculum(null);
    }
  }, [location.search, openDetail, selectedPLO, handleOpenDetail]);

  useEffect(() => {
    fetchPLOs();
  }, [fetchPLOs]);

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl">
      {/* Title + Breadcrumb */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-800">PLO Management</h1>
        <Breadcrumb className="my-6">
          <BreadcrumbList className="text-gray-500 text-sm">
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
            <BreadcrumbItem>PLOs</BreadcrumbItem>
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

        <div className="ml-auto flex gap-2">
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setOpenCreate(true)}
          >
            + Add a PLO
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
              <TableHead>Curriculum</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={8} />
            ) : plos.length > 0 ? (
              plos.map((plo, index) => (
                <TableRow key={plo.programingLearningOutcomeId} className="hover:bg-gray-50 transition-all">
                  <TableCell className="text-center">{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell className="truncate max-w-[100px]" title={plo.programingLearningOutcomeCode}>
                    {plo.programingLearningOutcomeCode}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]" title={plo.programingLearningOutcomeName}>
                    {plo.programingLearningOutcomeName}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[250px] cursor-pointer text-blue-600 hover:underline"
                    title={curriculumMap.get(plo.curriculumId) ?? "-"}
                    onClick={() => {
                      const curriculum = curriculums.find((c) => c.curriculumId === plo.curriculumId);
                      if (curriculum) {
                        setSelectedCurriculum(curriculum);
                        setOpenCurriculum(true);
                      }
                    }}
                  >
                    {curriculumMap.get(plo.curriculumId)}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]" title={formatDateTime(plo.createdAt)}>
                    {formatDateTime(plo.createdAt)}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]" title={formatDateTime(plo.updatedAt)}>
                    {formatDateTime(plo.updatedAt)}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]" title={plo.description}>
                    {plo.description}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(plo.programingLearningOutcomeId)}>
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-600 hover:scale-110 transition-transform cursor-pointer"
                      />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      size={18}
                      className="text-blue-500 hover:text-blue-600 hover:scale-110 transition-transform cursor-pointer"
                      onClick={() => navigate(`/admin/curriculum/details?id=${plo.programingLearningOutcomeId}`)}
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

      <ModalCurriculumDetail
        open={openCurriculum}
        onClose={() => setOpenCurriculum(false)}
        curriculum={selectedCurriculum}
      />
      <ModalCreatePLO
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={fetchPLOs}
        curriculums={curriculums}
      />
    </div>
  );
};

export default PLOManagement;
