// ✅ UPDATED Classes.jsx (adds "Videos" button inside accordion)
// It navigates to /video/:classId (your admin/video CRUD screen) OR you can open direct video url list
// Here we add: <Link to={`/video/${cls.id}`}> and pass cls.id (classId)

import {
  useDeleteClassMutation,
  useGetClassesByCourseQuery,
} from "@/store/api/class";
import { useGetCourseByIdQuery } from "@/store/api/course";
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Play,
  Clock,
  Users,
  Award,
  Globe,
  Check,
  Pencil,
  Trash2,
  Settings,
  BarChart3,
} from "lucide-react";
import Header from "@/components/Home/Header";
import { FileText, MessageCircle, PlayCircle, Video } from "lucide-react"; // ✅ add Video icon

import {
  useCheckEnrollmentQuery,
  useCreateEnrollmentMutation,
} from "@/store/api/enrollments";
import {
  isAdminUser,
  isTeacherUser,
  selectCurrentUser,
} from "@/store/reducer/auth";
import { useSelector } from "react-redux";
import { useOrderMutation } from "@/store/api/auth";

const Classes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [createrazorpayinstace] = useOrderMutation();
  const [openClassId, setOpenClassId] = useState(null);
  const [deletingClassId, setDeletingClassId] = useState(null);

  const user = useSelector(selectCurrentUser);
  const [createEnrollment] = useCreateEnrollmentMutation();

  const {
    data: classData,
    isLoading,
    isError,
    refetch: refetchClasses,
  } = useGetClassesByCourseQuery(id, { skip: !id });

  const { data: courseData } = useGetCourseByIdQuery(id, { skip: !id });

  const { data: enrollmentData } = useCheckEnrollmentQuery(
    { courseId: id, userId: user?.id },
    { skip: !id || !user },
  );

  const isEnrolled = enrollmentData?.enrolled === true;
  const course = courseData?.data;
  const classes = classData?.data || [];
  const isAdmin = isAdminUser(user);
  const canManageCourse = isTeacherUser(user);
  const hasLearningAccess = isEnrolled || canManageCourse;

  const client_id = user?.id || null;
  const [deleteClass] = useDeleteClassMutation();

  const toggleAccordion = (classId) => {
    setOpenClassId(openClassId === classId ? null : classId);
  };

  const handleDeleteClass = async (classItem) => {
    const confirmed = window.confirm(
      `Delete “${classItem.title}”? Its related learning content may also be affected.`,
    );
    if (!confirmed) return;

    try {
      setDeletingClassId(classItem.id);
      await deleteClass(classItem.id).unwrap();
      await refetchClasses();
    } catch (error) {
      alert(error?.data?.message || "Failed to delete class");
    } finally {
      setDeletingClassId(null);
    }
  };

  const handleEnroll = async () => {
    try {
      if (!id) {
        alert("Invalid course");
        return;
      }

      if (!user?.id) {
        alert("Please login to enroll");
        navigate("/login");
        return;
      }

      const total = Number(course?.discount_price ?? 0);

      // ✅ FREE COURSE: If amount is absolutely 0, don't open payment gateway
      if (total === 0) {
        try {
          await createEnrollment({
            client_id: client_id,
            course_id: id,
            status: "ENROLLED",
            transaction_id: "FREE", // or null if backend allows
            payment: 0,
            enrollment_for: "COURSE",
          }).unwrap();

          alert("Enrollment Successful 🎉 (Free Course)");
          window.location.reload();
        } catch (err) {
          console.error("Free enrollment failed", err);
          alert("Free enrollment failed");
        }
        return;
      }

      // ✅ Paid course: keep existing Razorpay flow
      if (total < 0) {
        alert("Invalid course price");
        return;
      }

      const orderResp = await createrazorpayinstace({
        clientId: client_id,
        amount: total,
      }).unwrap();

      const { order, keyId } = orderResp;

      if (!order?.id || !keyId) {
        throw new Error("Invalid Razorpay order response");
      }

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "CyberAwareness",
        description: course?.title || "Course Enrollment",
        order_id: order.id,

        handler: async (response) => {
          try {
            await createEnrollment({
              client_id: client_id,
              course_id: id,
              status: "ENROLLED",
              transaction_id: response.razorpay_payment_id,
              payment: total,
              enrollment_for: "COURSE",
            }).unwrap();

            alert("Enrollment Successful 🎉");
            window.location.reload();
          } catch (err) {
            console.error("Enrollment failed", err);
            alert("Payment done, but enrollment failed");
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: { color: "#10b981" },

        modal: {
          ondismiss: () => console.log("Payment popup closed"),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert("Failed to start payment");
    }
  };

  const handleJoinLiveClick = (classId, isLiveActive) => {
    if (!hasLearningAccess) {
      alert("Please enroll to join the live class");
      return;
    }

    if (!isLiveActive) {
      alert("Live class is not active right now");
      return;
    }

    navigate(`/live-class/${classId}`);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-2xl font-semibold text-gray-700">
          Loading course...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-2xl font-semibold text-red-600">
          Failed to load course
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="mt-25"></div>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={course?.images?.[0] || "/placeholder-course.jpg"}
            alt={course?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10 text-white max-w-4xl">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
              {course?.title}
            </h1>
            <p className="text-xl mb-6 opacity-90">{course?.description}</p>
            <div className="flex items-center gap-6 text-lg">
              <span className="flex items-center gap-2">
                <Users size={20} /> {course?.Instructor?.name}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={20} /> {course?.course_duration} hrs
              </span>
              <span className="flex items-center gap-2">
                <Globe size={20} /> {course?.course_type}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`max-w-7xl mx-auto grid gap-12 px-6 py-12 -mt-20 relative z-10 ${
            hasLearningAccess ? "lg:grid-cols-1" : "lg:grid-cols-3"
          }`}
        >
          {/* Left */}
          <div className={hasLearningAccess ? "lg:col-span-3" : "lg:col-span-2"}>
            {canManageCourse && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-bold text-emerald-900">
                    {isAdmin ? "Administrator course controls" : "Teacher course controls"}
                  </p>
                  <p className="text-sm text-emerald-800 mt-1">
                    Create, update or remove classes and manage every class resource.
                  </p>
                </div>
                <Link
                  to={`/admin-classes/${id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-white font-semibold hover:bg-emerald-800"
                >
                  <Settings size={18} /> Add or manage classes
                </Link>
              </div>
            )}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900">
                  Course Curriculum
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {classes.map((cls, index) => {
                  const isLiveClass = cls.class_type === "LIVE";

                  // ✅ ADD THIS HERE
                  const now = new Date();
                  const startTime = cls.class_start_time
                    ? new Date(cls.class_start_time)
                    : null;
                  const endTime = cls.class_end_time
                    ? new Date(cls.class_end_time)
                    : null;

                  const isLiveActive =
                    startTime && endTime && now >= startTime && now <= endTime;
                  return (
                    <div key={cls.id} className="transition-all duration-300">
                      <button
                        onClick={() =>
                          hasLearningAccess && !isLiveClass && toggleAccordion(cls.id)
                        }
                        disabled={!hasLearningAccess && !isLiveClass}
                        className={`w-full px-8 py-6 flex items-center justify-between text-left transition
                          ${
                            !hasLearningAccess && !isLiveClass
                              ? "cursor-not-allowed opacity-70"
                              : "hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img
                              src={cls.thumbnail}
                              alt={cls.title}
                              className="w-24 h-20 object-cover rounded-xl shadow-md"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 hover:opacity-100 transition">
                              <Play
                                className="text-white"
                                size={32}
                                fill="white"
                              />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {index + 1}. {cls.title}
                            </h3>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                              <Clock size={16} /> {cls.class_duration} mins •{" "}
                              {cls.class_type}
                            </p>
                          </div>

                          {/* ✅ LIVE join */}
                          {isLiveClass && (
                            <div className="mt-4">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleJoinLiveClick(cls.id, isLiveActive);
                                }}
                                disabled={!hasLearningAccess || !isLiveActive}
                                className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl shadow transition-all duration-300
    ${
      hasLearningAccess && isLiveActive
        ? "bg-red-600 hover:bg-red-700 text-white scale-100"
        : "bg-red-200 text-red-400 opacity-60 cursor-not-allowed scale-95"
    }
  `}
                              >
                                <Play size={20} />
                                Join Live Class
                              </button>

                              <p className="text-sm text-gray-500 mt-2">
                                Live:{" "}
                                {cls.class_start_time
                                  ? new Date(
                                      cls.class_start_time,
                                    ).toLocaleString()
                                  : "-"}
                              </p>

                              {!hasLearningAccess && (
                                <p className="text-sm text-red-600 mt-1 font-medium">
                                  Enroll to access live classes
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {!isLiveClass && (
                          <ChevronDown
                            size={24}
                            className={`text-gray-500 transition-transform ${
                              openClassId === cls.id ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {canManageCourse && (
                        <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                          <Link className="class-admin-action" to={`/admin-classes/${id}`}>
                            <Pencil size={15} /> Edit class
                          </Link>
                          <Link className="class-admin-action" to={`/admin-video/${cls.id}`}>
                            <Video size={15} /> Videos
                          </Link>
                          <Link className="class-admin-action" to={`/admin-materials/${cls.id}`}>
                            <FileText size={15} /> Materials
                          </Link>
                          <Link className="class-admin-action" to={`/admin-question/${cls.id}`}>
                            <MessageCircle size={15} /> Questions
                          </Link>
                          <Link className="class-admin-action" to={`/admin-results/${cls.id}`}>
                            <BarChart3 size={15} /> Results
                          </Link>
                          <button
                            type="button"
                            className="class-admin-action is-delete"
                            onClick={() => handleDeleteClass(cls)}
                            disabled={deletingClassId === cls.id}
                          >
                            <Trash2 size={15} />
                            {deletingClassId === cls.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      )}

                      {/* ✅ Accordion Content */}
                      {!isLiveClass && openClassId === cls.id && (
                        <div className="px-8 pb-8">
                          <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            {/* ✅ NEW: Videos button */}
                            {hasLearningAccess ? (
                              <Link to={`/video/${cls.id}`}>
                                <button className="w-full flex items-center gap-3 p-4 rounded-xl border hover:border-emerald-500 hover:bg-emerald-50 transition">
                                  <Video className="text-emerald-600" />
                                  <div className="text-left">
                                    <p className="font-semibold text-gray-800">
                                      Videos
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Watch class videos
                                    </p>
                                  </div>
                                </button>
                              </Link>
                            ) : (
                              <div className="opacity-60 cursor-not-allowed">
                                <div className="w-full flex items-center gap-3 p-4 rounded-xl border bg-gray-50">
                                  <Video className="text-gray-400" />
                                  <div className="text-left">
                                    <p className="font-semibold text-gray-500">
                                      Videos (Locked)
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      Enroll to access videos
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Materials */}
                            {hasLearningAccess ? (
                              <Link to={`/materials/${cls.id}`}>
                                <button className="w-full flex items-center gap-3 p-4 rounded-xl border hover:border-blue-500 hover:bg-blue-50 transition">
                                  <FileText className="text-blue-600" />
                                  <div className="text-left">
                                    <p className="font-semibold text-gray-800">
                                      Materials
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Notes & downloadable resources
                                    </p>
                                  </div>
                                </button>
                              </Link>
                            ) : (
                              <div className="opacity-60 cursor-not-allowed">
                                <div className="w-full flex items-center gap-3 p-4 rounded-xl border bg-gray-50">
                                  <FileText className="text-gray-400" />
                                  <div className="text-left">
                                    <p className="font-semibold text-gray-500">
                                      Materials (Locked)
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      Enroll to access this content
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Q & A */}
                            <Link to={`/questions/${cls.id}`}>
                              <button className="w-full flex items-center gap-3 p-4 rounded-xl border hover:border-purple-500 hover:bg-purple-50 transition">
                                <MessageCircle className="text-purple-600" />
                                <div className="text-left">
                                  <p className="font-semibold text-gray-800">
                                    Question
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    give mcq exam
                                  </p>
                                </div>
                              </button>
                            </Link>

                            {/* View Result */}
                            <Link to={`/view-result/${cls.id}`}>
                              <button className="w-full flex items-center gap-3 p-4 rounded-xl border hover:border-orange-500 hover:bg-orange-50 transition">
                                <PlayCircle className="text-orange-600" />
                                <div className="text-left">
                                  <p className="font-semibold text-gray-800">
                                    View Result
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    view your score
                                  </p>
                                </div>
                              </button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Enrollment Card */}
          {!hasLearningAccess && (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="relative -mt-20 mb-8">
                  <img
                    src={course?.images?.[0]}
                    alt={course?.title}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                    <Award size={18} /> 4.8 Rating
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-extrabold text-emerald-600">
                      ₹{course?.discount_price}
                    </span>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{course?.actual_price}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-600 font-semibold">
                    Save{" "}
                    {course?.actual_price
                      ? Math.round(
                          100 -
                            (course?.discount_price / course?.actual_price) *
                              100,
                        )
                      : 0}
                    %
                  </p>
                </div>

                <button
                  onClick={handleEnroll}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-105 mb-8"
                >
                  Enroll Now
                </button>

                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center gap-3">
                    <Check className="text-emerald-600" size={20} />
                    Full lifetime access
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-emerald-600" size={20} />
                    {classData?.total} premium classes
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-emerald-600" size={20} />
                    Certificate of completion
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-emerald-600" size={20} />
                    Access on mobile & desktop
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Classes;
