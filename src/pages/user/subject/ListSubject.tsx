import { useState, useEffect } from "react";
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

const ListSubject = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
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
      console.error('Failed to search subjects:', error);
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
            <BreadcrumbLink>View Subjects</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">View Subjects</h1>

      <div className="flex items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Subject Code:</label>
          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter subject code..."
              className="w-[146px]"
            />
            <Button onClick={handleSearch} className="bg-[#28a745] hover:bg-[#218838]">
              Search
            </Button>
          </div>
        </div>
      </div>

      {subjects.length > 0 && (
        <span className="text-[#23AC68]">All {subjects.length} syllabus(es)</span>
      )}

      <Card className="mt-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Syllabus ID</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Syllabus Name</TableHead>
                <TableHead>Decision No</TableHead>
                <TableHead>Pre-requisites</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No subjects found
                  </TableCell>
                </TableRow>
              ) : (
                subjects.map((subject, index) => (
                  <TableRow key={subject.subjectId} className="hover:bg-slate-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{subject.subjectId}</TableCell>
                    <TableCell>{subject.subjectCode}</TableCell>
                    <TableCell>
                      <Link
                        to={`/user/syllabus/${subject.subjectId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {subject.syllabusName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {subject.decisionNo} dated {new Date(subject.approvedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <p className="font-bold pl-4">
                        {subject.subjectCode}: (No pre-requisite)
                      </p>
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

export default ListSubject;