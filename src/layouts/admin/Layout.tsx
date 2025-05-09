import SideBar from "@/components/layouts/admin/Sidebar";
import Header from "@/components/layouts/admin/Header";
import PageTransitionLoader from "@/components/layouts/admin/PageTransitionLoader";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen h-screen bg-gray-200">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <PageTransitionLoader>
            <Outlet />
          </PageTransitionLoader>
        </main>
      </div>
    </div>
  );
}
