import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search, FileText, Home } from "lucide-react";

const ListCurriculum = () => {
  const [curricula, setCurriculum] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with actual API call
    } catch (error) {
      console.error('Failed to search curricula:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/user"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>View Curriculum</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">View Curriculum</h1>

      <div className="flex items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Curriculum Code:</label>
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter curriculum code..."
              className="w-[200px]"
            />
            <Button onClick={handleSearch} className="bg-[#28a745] hover:bg-[#218838]">
              Search
            </Button>
          </div>
        </div>
      </div>

      {curricula.length > 0 && (
        <span className="text-[#23AC68]">All {curricula.length} curriculum(s)</span>
      )}

      <Card className="mt-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Decision No.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : curricula.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No curriculum found
                  </TableCell>
                </TableRow>
              ) : (
                curricula.map((curriculum, index) => (
                  <TableRow key={curriculum.curriculumId} className="hover:bg-slate-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{curriculum.curriculumCode}</TableCell>
                    <TableCell>{curriculum.curriculumName}</TableCell>
                    <TableCell>{curriculum.decisionNo}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${curriculum.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {curriculum.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/user/curriculum/${curriculum.curriculumId}`}>
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>{currentPage}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ListCurriculum;