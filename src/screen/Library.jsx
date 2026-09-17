import { useGetEnrollmentsByClientQuery } from "@/store/api/enrollments";
import { selectCurrentUser } from "@/store/reducer/auth";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, CheckCircle } from "lucide-react";
import Header from "@/components/Home/Header";

const Library = () => {
  const clientId = useSelector(selectCurrentUser)?.id;
  const { data, isLoading } = useGetEnrollmentsByClientQuery(clientId, {
    skip: !clientId,
  });

  const enrollments = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading your courses...
        </p>
      </div>
    );
  }

  if (!enrollments.length) {
    return (
      <>
        <Header/>
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        
        <BookOpen size={60} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">
          No courses yet
        </h2>
        <p className="text-gray-500 mt-2">
          Enroll in a course to see it here.
        </p>
      </div>
      </>
    );
  }

  return (
    <>
  <Header/>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
          My Library
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrollments.map((enroll) => {
            const course = enroll.Course;

            return (
              <div
                key={enroll.id}
                className="bg-white rounded-3xl shadow-lg border hover:shadow-2xl transition overflow-hidden"
              >
                {/* Course Image */}
                <div className="relative">
                  <img
                    src={course.images?.[0] || "/placeholder-course.jpg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 text-sm rounded-full flex items-center gap-1">
                    <CheckCircle size={14} />
                    Enrolled
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {course.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(enroll.enrolled_at).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-emerald-600">
                      ₹{enroll.payment}
                    </span>
                  </div>

                  <Link to={`/classes/${course.id}`}>
                    <button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition transform hover:scale-105">
                      Continue Learning
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default Library;
