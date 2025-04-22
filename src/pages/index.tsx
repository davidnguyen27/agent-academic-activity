import { useState } from "react";

export default function SignIn() {
  const [educationLevel, setEducationLevel] = useState("FPTU");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-7xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-10">
          FPT Education Learning Materials
        </h1>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Guest Features Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 text-center">Guest Features</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">FPT Schools</h3>
                <div className="space-y-2">
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">
                    View Curriculums and Syllabi
                  </button>
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">
                    Show Learning Path of a Subject
                  </button>
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">
                    A subject is the pre-requisite of
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">FPT University</h3>
                <div className="space-y-2">
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">
                    View Curricula and Syllabi
                  </button>
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">
                    Show Learning Path of a Subject
                  </button>
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">
                    A subject is the pre-requisite of
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 text-center">Sign In</h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-600">Select Education Level:</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
              >
                <option value="FPTU">FPT University</option>
                <option value="FPTSchools">FPT Schools</option>
              </select>

              <div className="text-sm text-gray-700">
                Sign in using <span className="font-semibold">@fpt.edu.vn</span>
              </div>

              <button className="w-full border border-gray-300 rounded-full py-2 hover:shadow text-sm font-medium">
                Sign in with Google
              </button>

              <div className="text-sm text-gray-600">
                Với sinh viên từ <span className="font-semibold">K19</span> đăng nhập với FEID
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">
                Login with FEID
              </button>

              <div className="text-right">
                <a href="/authentication" className="text-xs text-blue-600 hover:underline">
                  Sign in for Syllabus Reviewer/Designer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
