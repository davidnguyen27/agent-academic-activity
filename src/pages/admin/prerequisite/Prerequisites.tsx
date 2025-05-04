import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useDebounce } from "@/hooks/useDebounce";
import { useLoading } from "@/hooks/useLoading";
import { prerequisiteService } from "@/services/prerequisite.service";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/layouts/admin/ModalConfirm";
import { EmptySearchResult } from "@/components/common/EmptySearchResult";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { subjectService } from "@/services/subject.service";
import ModalSubjectDetail from "@/components/layouts/admin/subjects/ModalDetail";
import ModalEditPrerequisite from "@/components/layouts/admin/prerequisites/ModalEdit";
import ModalCreatePrerequisite from "@/components/layouts/admin/prerequisites/ModalCreate";

const PrerequisitesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"code" | "name" | "default">("default");
  const [sortType, setSortType] = useState<"Ascending" | "Descending">("Ascending");
  const [deletedFilter, setDeletedFilter] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState<Prerequisite | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const { isLoading, startLoading } = useLoading();
  const pageSize = 10;

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

  const fetchPrerequisites = useCallback(async () => {
    try {
      const res = await startLoading(() =>
        prerequisiteService.getAllPrerequisites({
          pageNumber: page,
          pageSize,
          search: debouncedSearch,
          sortBy: sortBy === "default" ? undefined : sortBy,
          sortType,
          isDelete: deletedFilter,
        })
      );
      setPrerequisites(res.items);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to fetch prerequisites");
    }
  }, [page, pageSize, debouncedSearch, sortBy, sortType, deletedFilter, startLoading]);

  const handleDelete = async (id: string) => {
    try {
      await prerequisiteService.deletePrerequisite(id);
      toast.success("Deleted successfully!");
      await fetchPrerequisites();
    } catch {
      toast.error("Delete failed!");
    }
  };

  const handleOpenDetail = useCallback(async (id: string) => {
    try {
      const data = await prerequisiteService.getPrerequisiteById(id);
      setSelectedPrerequisite(data);
      setOpenDetail(true);
    } catch {
      toast.error("Failed to load curriculum details");
    }
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id");

    if (id && (!openDetail || selectedPrerequisite?.prerequisiteConstraintId !== id)) {
      handleOpenDetail(id);
    }
    if (!id && openDetail) {
      setOpenDetail(false);
      setSelectedPrerequisite(null);
    }
  }, [location.search, openDetail, selectedPrerequisite, handleOpenDetail]);

  useEffect(() => {
    fetchPrerequisites();
  }, [fetchPrerequisites]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Prerequisite Management</h1>
      </div>

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin/subject">Subject</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Prerequisites</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Filters */}
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
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
              <SelectValue placeholder="Sort type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ascending">Ascending</SelectItem>
              <SelectItem value="Descending">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status</label>
          <Select onValueChange={(v) => setDeletedFilter(v === "true")} defaultValue="false">
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
          <Button className="bg-blue-600 text-white" onClick={() => setOpenCreateModal(true)}>
            + Add Prerequisite
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-center">#</TableHead>
              <TableHead>Constraint Code</TableHead>
              <TableHead>Group Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={5} />
            ) : prerequisites.length > 0 ? (
              prerequisites.map((p, i) => (
                <TableRow key={p.prerequisiteConstraintId}>
                  <TableCell className="text-center">{(page - 1) * pageSize + i + 1}</TableCell>
                  <TableCell>{p.prerequisiteConstraintCode}</TableCell>
                  <TableCell>{p.groupCombinationType}</TableCell>
                  <TableCell
                    className="truncate max-w-[100px] cursor-pointer text-blue-600 hover:underline"
                    title={subjectMap.get(p.subjectId) ?? "-"}
                    onClick={() => {
                      const subject = subjects.find((s) => s.subjectId === p.subjectId);
                      if (subject) {
                        setSelectedSubject(subject);
                        setOpenSubject(true);
                      }
                    }}
                  >
                    {subjectMap.get(p.subjectId)}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <ConfirmDeleteDialog onConfirm={() => handleDelete(p.prerequisiteConstraintId)}>
                      <Trash2 className="text-red-500 cursor-pointer" size={18} />
                    </ConfirmDeleteDialog>
                    <BadgeInfo
                      className="text-blue-500 cursor-pointer"
                      size={18}
                      onClick={() => navigate(`/admin/subject/prerequisite?id=${p.prerequisiteConstraintId}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
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
              <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(1, p - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ModalSubjectDetail open={openSubject} onClose={() => setOpenSubject(false)} subject={selectedSubject} />
      <ModalCreatePrerequisite
        open={openCreateModal}
        onSuccess={fetchPrerequisites}
        onOpenChange={setOpenCreateModal}
      />
      <ModalEditPrerequisite
        open={openDetail}
        prerequisite={selectedPrerequisite}
        onSuccess={fetchPrerequisites}
        onOpenChange={(open) => {
          setOpenDetail(open);
          if (!open) navigate("/admin/subject/prerequisite", { replace: true });
        }}
      />
    </div>
  );
};

export default PrerequisitesManagement;
