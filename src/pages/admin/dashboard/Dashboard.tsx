import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { dashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, CalendarCheck } from "lucide-react";
import renderLineChart from "@/components/layouts/admin/charts/Chart";
import { studentService } from "@/services/student.service";
import { majorService } from "@/services/major.service";
import { curriculumService } from "@/services/curriculum.service";
import { groupByCreatedAt } from "@/utils/groupByDate.utils";

interface DailyData {
  date: string;
  count: number;
}

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [report, setReport] = useState<{
    totalStudents: number;
    totalMajors: number;
    totalCurriculums: number;
    totalMessages: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [dailyStudents, setDailyStudents] = useState<DailyData[]>([]);
  const [dailyMajors, setDailyMajors] = useState<DailyData[]>([]);
  const [dailyCurriculums, setDailyCurriculums] = useState<DailyData[]>([]);
  const [dailyMessages] = useState<DailyData[]>([]);

  const barColors = ["#3b82f6", "#f97316", "#10b981", "#a855f7"];

  const summaryChartData = useMemo(
    () => [
      { label: "Students", value: report?.totalStudents ?? 0 },
      { label: "Majors", value: report?.totalMajors ?? 0 },
      { label: "Curriculums", value: report?.totalCurriculums ?? 0 },
      { label: "Messages", value: report?.totalMessages ?? 0 },
    ],
    [report]
  );

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const res = await dashboardService.adminReport();
        if (res.isSucess) {
          const { totalStudents, totalMajors, totalCurriculums, totalMessages } = res.data;
          setReport({ totalStudents, totalMajors, totalCurriculums, totalMessages });
        }
      } catch {
        console.error("Failed to fetch dashboard report");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDailyData = async () => {
      try {
        const [studentsRes, majorsRes, curriculumsRes] = await Promise.all([
          studentService.getAllStudents({ pageSize: 1000 }),
          majorService.getAllMajors({ pageSize: 1000 }),
          curriculumService.getAllCurriculums({ pageSize: 1000 }),
        ]);

        setDailyStudents(groupByCreatedAt(studentsRes.items));
        setDailyMajors(groupByCreatedAt(majorsRes.items));
        setDailyCurriculums(groupByCreatedAt(curriculumsRes.items));
      } catch (error) {
        console.error("Failed to fetch daily data", error);
      }
    };

    fetchReport();
    fetchDailyData();
  }, []);

  const renderValue = (value?: number) =>
    isLoading ? <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" /> : value;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin 👋</h1>
        <p className="text-sm text-muted-foreground">
          This is your academic management dashboard. Check the latest stats and system activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renderValue(report?.totalStudents)}</div>
            <p className="text-xs text-muted-foreground">Up 3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Majors</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renderValue(report?.totalMajors)}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Curriculums</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renderValue(report?.totalCurriculums)}</div>
            <p className="text-xs text-muted-foreground">Approved programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Messages</CardTitle>
            <CalendarCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renderValue(report?.totalMessages)}</div>
            <p className="text-xs text-muted-foreground">Sent successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Bar Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overview Chart</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {summaryChartData.map((_, index) => (
                    <Cell key={index} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar onChange={(value) => value && setDate(value as Date)} value={date} locale="en-US" />
          </CardContent>
        </Card>
      </div>

      {/* Daily Line Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {renderLineChart("Students per Day", dailyStudents, "#3b82f6")}
        {renderLineChart("Majors per Day", dailyMajors, "#f97316")}
        {renderLineChart("Curriculums per Day", dailyCurriculums, "#10b981")}
        {renderLineChart("AI Messages per Day", dailyMessages, "#a855f7")}
      </div>
    </div>
  );
};

export default Dashboard;
