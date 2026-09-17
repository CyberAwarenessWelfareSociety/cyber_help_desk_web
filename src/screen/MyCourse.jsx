import Header from "@/components/Home/Header";
import { useShowCourseOnlyInstructorQuery } from "@/store/api/course";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Clock,
  IndianRupee,
  Plus,
  BookOpen,
  Eye,
  Pencil,
} from "lucide-react";

const MyCourse = () => {
  const userId = useSelector((state) => state.auth.user?.id);

  const { data, isLoading, isError } =
    useShowCourseOnlyInstructorQuery({userId}, {
      skip: !userId,
    });

  const courses = data?.data || [];

  // ✅ LOADING
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  // ✅ ERROR
  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
          Failed to load your courses
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto mt-21">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold">My Courses</h1>
              <p className="text-gray-600 mt-2">
                Manage and grow your teaching empire 🚀
              </p>
            </div>

            <Link
              to="/create-course"
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              <Plus size={18} />
              Create Course
            </Link>
          </div>

          {/* EMPTY STATE */}
          {courses.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-16 text-center">
              <BookOpen size={60} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold mb-2">
                No courses yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start building your first course and earn money 💰
              </p>

              <Link
                to="/create-course"
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700"
              >
                Create Your First Course
              </Link>
            </div>
          )}

          {/* COURSES GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const discount =
                course.actual_price > course.discount_price
                  ? Math.round(
                      ((course.actual_price - course.discount_price) /
                        course.actual_price) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={
                        course.images?.[0] ||
                        "/placeholder-course.jpg"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />

                    {/* PUBLISHED BADGE */}
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${
                        course.is_published
                          ? "bg-green-500 text-white"
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {course.is_published
                        ? "Published"
                        : "Draft"}
                    </span>

                    {discount > 0 && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      {course.title}
                    </h2>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    {/* META */}
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {course.course_duration} hrs
                      </span>

                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {course.course_type}
                      </span>
                    </div>

                    {/* PRICE */}
                    <div className="flex items-center gap-2 mb-5">
                      <IndianRupee size={18} />
                      <span className="text-2xl font-bold text-emerald-600">
                        {course.discount_price}
                      </span>

                      {discount > 0 && (
                        <span className="line-through text-gray-400">
                          ₹{course.actual_price}
                        </span>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 mt-auto">
                      <Link
                        to={`/admin-classes/${course.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <Link
                        to={`/edit-course/${course.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>
                    </div>
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

export default MyCourse;
