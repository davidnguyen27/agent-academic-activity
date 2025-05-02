import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/configs/firebase.config";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const idToken = credential.idToken;
        const { accessToken, refreshToken } = await authService.loginGoogle({ token: idToken ?? "" });
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        console.log(idToken);

        const user = await authService.currentUser();

        localStorage.setItem("user", JSON.stringify(user.student));
        localStorage.setItem("role", user.user.role);
        setUser(user.student);

        toast.success(`Welcome back, ${user.student.fullName}`);
        navigate("/user/chat");
      }
    } catch {
      toast.error("Sign in failed. Please try again.");
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 px-6 py-8 animate-fade">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">AI Learning Materials</h1>
          <p className="text-sm text-gray-500">Explore subjects, discover learning paths, plan your future with AI.</p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition active:scale-95 disabled:opacity-60"
        >
          {isSigningIn ? (
            <div className="animate-spin w-5 h-5 border-2 border-t-transparent border-white rounded-full"></div>
          ) : (
            <>
              <FcGoogle size={22} />
              Sign in with Google
            </>
          )}
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* FEID Login */}
        <button
          onClick={() => navigate("/authentication")}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold transition active:scale-95"
        >
          Login with FEID
        </button>

        {/* Reviewer/Designer link */}
        <div className="text-center">
          <a href="/authentication" className="text-xs text-indigo-600 hover:underline">
            Syllabus Reviewer / Designer Login
          </a>
        </div>
      </div>
    </div>
  );
}
