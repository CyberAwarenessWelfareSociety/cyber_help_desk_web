import React from "react";
import { Users } from "lucide-react"; // Optional icon
import Header from "@/components/Home/Header";

export default function ComingSoonPage() {
  return (
    <>
<Header />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50 px-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Home / <span className="font-semibold text-gray-800">Our Team</span>
      </div>

      {/* Main Content */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-4">Our Team</h1>
        <p className="text-gray-600 text-lg mb-6">
          Update Soon! We're building something amazing.
        </p>

        <a
          href="/"
          className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl shadow hover:bg-emerald-700 transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
        </>
  );
}
