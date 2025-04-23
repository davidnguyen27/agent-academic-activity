import AppRoutes from "@/routers";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </>
  );
}
