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
import { Home, Book } from "lucide-react";

interface Subject {
  subjectCode: string;
  subjectName: string;
  noCredit: number;
  sessionNo: number;
  description: string;
  studentTasks: string;
  timeAllocation: string;
  scoringScale: number;
  minAvgMarkToPass: number;
  decisionNo: string;
  isActive: boolean;
  degreeLevel: string;
}

const DetailSubject = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState<Subject>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Mock data
      setSubject({
        subjectCode: "CS102",
        subjectName: "Data Structures",
        noCredit: 4,
        sessionNo: 60,
        description:
          "This course introduces fundamental data structures such as stacks, queues, linked lists, trees, and graphs.",
        studentTasks: "Homework assignments, quizzes, lab exercises.",
        timeAllocation: "40 lecture hours, 20 lab hours",
        scoringScale: 10,
        minAvgMarkToPass: 5,
        decisionNo: "D2025-102",
        isActive: true,
        degreeLevel: "Bachelor",
      });

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/user/home">
                <Home className="h-4 w-4" />
              </Link>
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

      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-bold">{subject?.subjectName}</h1>
        <Button variant="outline" asChild>
          <Link to={`/user/syllabus/${subject?.subjectCode}`}>View Syllabus</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Subject Details</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Subject Code:</span>
                <p>{subject?.subjectCode}</p>
              </div>
              <div>
                <span className="font-semibold">Credits:</span>
                <p>{subject?.noCredit}</p>
              </div>
              <div>
                <span className="font-semibold">Decision No:</span>
                <p>{subject?.decisionNo}</p>
              </div>
              <div>
                <span className="font-semibold">Status:</span>
                <p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                    ${subject?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {subject?.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <span className="font-semibold">Description:</span>
              <p className="mt-2 whitespace-pre-line">{subject?.description}</p>
            </div>

            <div>
              <span className="font-semibold">Student Tasks:</span>
              <p className="mt-2 whitespace-pre-line">{subject?.studentTasks}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Time Allocation:</span>
                <p>{subject?.timeAllocation}</p>
              </div>
              <div>
                <span className="font-semibold">Scoring Scale:</span>
                <p>{subject?.scoringScale}</p>
              </div>
              <div>
                <span className="font-semibold">Min Mark to Pass:</span>
                <p>{subject?.minAvgMarkToPass}</p>
              </div>
              <div>
                <span className="font-semibold">Degree Level:</span>
                <p>{subject?.degreeLevel}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailSubject;
