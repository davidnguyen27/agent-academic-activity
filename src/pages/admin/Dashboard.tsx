import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, CalendarCheck } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  const studentsByMajor = [
    { major: "CNTT", students: 450 },
    { major: "Kinh tế", students: 300 },
    { major: "Ngôn ngữ", students: 220 },
    { major: "Thiết kế", students: 130 },
  ];

  const topicsByMonth = [
    { month: "1", topics: 5 },
    { month: "2", topics: 8 },
    { month: "3", topics: 12 },
    { month: "4", topics: 20 },
    { month: "5", topics: 15 },
    { month: "6", topics: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Xin chào, Admin 👋</h1>
        <p className="text-sm text-muted-foreground">
          Đây là bảng điều khiển tổng quan hệ thống học vụ. Kiểm tra các chỉ số và hoạt động gần đây.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng sinh viên</CardTitle>
            <GraduationCap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">Tăng 3% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Giảng viên</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">Ổn định trong 3 tháng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Môn học</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Đã cập nhật 2 môn mới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lịch bảo vệ</CardTitle>
            <CalendarCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 sự kiện</div>
            <p className="text-xs text-muted-foreground">Tuần này</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ 1 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sinh viên theo chuyên ngành</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByMajor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="major" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lịch dương */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch tháng</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar onChange={(value) => value && setDate(value as Date)} value={date} locale="vi-VN" />
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Đề tài theo tháng</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="topics" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
