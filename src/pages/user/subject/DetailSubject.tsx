import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Book, Calendar, GraduationCap, ClipboardList } from "lucide-react";
import { format } from "date-fns";

const DetailSubject = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
      } catch (error) {
        console.error('Failed to fetch subject:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!subject) {
    return <div className="flex justify-center items-center min-h-screen">Subject not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/user/home"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/user/subjects">Subjects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{subject?.subjectCode}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Subject Code:</span>
                <p>{subject.subjectCode}</p>
              </div>
              <div>
                <span className="font-semibold">Subject Name:</span>
                <p>{subject.subjectName}</p>
              </div>
              <div>
                <span className="font-semibold">Credits:</span>
                <p>{subject.noCredit}</p>
              </div>
              <div>
                <span className="font-semibold">Sessions:</span>
                <p>{subject.sessionNo}</p>
              </div>
            </div>

            <div>
              <span className="font-semibold">Description:</span>
              <p className="mt-2 whitespace-pre-line">{subject.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Time & Requirements</h2>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <span className="font-semibold">Time Allocation:</span>
              <p>{subject.timeAllocation}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Scoring Scale:</span>
                <p>{subject.scoringScale}</p>
              </div>
              <div>
                <span className="font-semibold">Minimum Pass Mark:</span>
                <p>{subject.minAvgMarkToPass}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Student Tasks & Notes</h2>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <span className="font-semibold">Student Tasks:</span>
              <p className="mt-2 whitespace-pre-line">{subject.studentTasks}</p>
            </div>
            {subject.note && (
              <div>
                <span className="font-semibold">Additional Notes:</span>
                <p className="mt-2 whitespace-pre-line">{subject.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Administrative Details</h2>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Decision No:</span>
              <p>{subject.decisionNo}</p>
            </div>
            <div>
              <span className="font-semibold">Approval Date:</span>
              <p>{format(new Date(subject.approvedDate), 'PPP')}</p>
            </div>
            <div>
              <span className="font-semibold">Status:</span>
              <div className="flex gap-2 mt-1">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                  ${subject.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {subject.isActive ? "Active" : "Inactive"}
                </span>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                  ${subject.isApproved ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {subject.isApproved ? "Approved" : "Pending Approval"}
                </span>
              </div>
            </div>
            <div>
              <span className="font-semibold">Degree Level:</span>
              <p>{subject.degreeLevel}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailSubject;