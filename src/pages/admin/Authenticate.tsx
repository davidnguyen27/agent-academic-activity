import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import AdminPanel from "@/constants/images";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Authentication() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.authenticate(data);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", "Admin");
      toast.success("Login successfully");
      navigate("/admin/dashboard");
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Sticker Flaticon */}
        <div className="flex justify-center">
          <img src={AdminPanel} alt="Admin Sticker" className="w-20 h-20 object-contain" />
        </div>

        {/* Title + Slogan */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel Login</h1>
          <p className="text-sm text-gray-500">Manage your system smartly and securely.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Input placeholder="Email" {...register("email")} className="focus:ring-2 focus:ring-blue-400" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-4">&copy; 2025 Admin Portal. All rights reserved.</div>
      </div>
    </div>
  );
}
