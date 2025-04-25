import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTransitionLoader from "@/components/layouts/admin/PageTransitionLoader";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const UserLayout = () => {
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-[#F2994A] text-white px-4 py-2 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to="/home"
            className="bg-[#28a745] text-white font-bold px-4 py-2 rounded hover:bg-[#218838] flex items-center gap-2"
          >
            <i className="fa fa-home text-2xl"></i>
            <span>Home</span>
          </Link>

          <h1 className="text-2xl font-bold absolute left-1/2 -translate-x-1/2">
            FPT University Learning Materials
          </h1>

          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[130px] bg-white text-black">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="vi">Vietnamese</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <img 
                  src="sample.jpg"
                  className="rounded-full w-[50px] h-[50px]"
                  alt="Profile"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between">
                      <span className="font-semibold">Name:</span>
                      <span>Sample User Name</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Email:</span>
                      <span>Sample Mail</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Role:</span>
                      <span>Sample role</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Education:</span>
                      <span>Sample School</span>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="justify-center">
                  <Link to="/logout" className="text-red-500 font-medium">
                    Sign out FLM
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-[#fafafa]">
        <div className="container mx-auto p-6">
          <PageTransitionLoader>
            <Outlet />
          </PageTransitionLoader>
        </div>
      </main>
      
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
        onClick={() => {/* Add chat functionality */}}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default UserLayout;