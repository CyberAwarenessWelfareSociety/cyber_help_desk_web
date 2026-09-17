// src/pages/courses/EditCourse.jsx
import Header from "@/components/Home/Header";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import {
  useShowCourseOnlyInstructorQuery,
  useUpdateCourseMutation,
} from "@/store/api/course";

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const EditCourse = () => {
  const { id } = useParams(); // course id
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?.id);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useShowCourseOnlyInstructorQuery({ userId, id }, { skip: !userId || !id });

  // ✅ API returns: { success, message, total, data: [ {...course} ] }
  const course = useMemo(() => {
    const d = response?.data;
    return Array.isArray(d) ? d[0] || null : d || null;
  }, [response]);

  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    course_duration: 0,
    course_type: "NORMAL",
    actual_price: "",
    discount_price: "",
    is_published: false,
    images: [],
    // === New Certificate Fields ===
    is_certificate_enabled: false,
    certificate_text: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // ✅ Hydrate once data arrives
  useEffect(() => {
    if (!course) return;

    setForm({
      title: course.title || "",
      description: course.description || "",
      course_duration: toNumber(course.course_duration, 0),
      course_type: course.course_type || "NORMAL",
      actual_price: course.actual_price ?? "",
      discount_price: course.discount_price ?? "",
      is_published: !!course.is_published,
      images: Array.isArray(course.images) ? course.images : [],
      // === New Certificate Fields ===
      is_certificate_enabled: !!course.is_certificate_enabled,
      certificate_text: course.certificate_text || "",
    });
  }, [course]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Upload image -> API returns url -> push to images[]
  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    const currentCount = Array.isArray(form.images) ? form.images.length : 0;
    if (currentCount >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingImage(true);

      const res = await axios.post(
        "https://bucket.cyberawareness.ngo/bucket/upload/cybercrime",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const url =
        res?.data?.file?.url ||
        res?.data?.file?.[0]?.url ||
        res?.data?.url;

      if (!url) {
        toast.error("Upload failed — no URL returned");
        return;
      }

      setForm((prev) => {
        const prevImages = Array.isArray(prev.images) ? prev.images : [];
        if (prevImages.includes(url)) return prev;
        return { ...prev, images: [...prevImages, url] };
      });

      toast.success("Image uploaded");
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err?.response?.data?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (idx) => {
    setForm((p) => ({
      ...p,
      images: (p.images || []).filter((_, i) => i !== idx),
    }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.course_type) return "Course type is required";

    const actual = toNumber(form.actual_price, NaN);
    const discount = toNumber(form.discount_price, NaN);

    if (!Number.isFinite(actual) || actual < 0) return "Actual price must be valid";
    if (!Number.isFinite(discount) || discount < 0)
      return "Discount price must be valid";
    if (discount > actual)
      return "Discount price cannot be greater than actual price";

    const dur = toNumber(form.course_duration, NaN);
    if (!Number.isFinite(dur) || dur < 0) return "Duration must be valid";

    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) return toast.error(msg);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || null,
        course_duration: toNumber(form.course_duration, 0),
        course_type: form.course_type,
        actual_price: String(form.actual_price ?? "0"),
        discount_price: String(form.discount_price ?? "0"),
        images: Array.isArray(form.images) ? form.images : [],
        is_published: !!form.is_published,
        // === New Certificate Fields ===
        is_certificate_enabled: !!form.is_certificate_enabled,
        certificate_text: form.certificate_text?.trim() || null,
      };

      const res = await updateCourse({ id, data: payload }).unwrap();

      toast.success(res?.message || "Course updated successfully");
      navigate("/mycourse");
    } catch (err) {
      console.error("Update Course Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to update course");
    }
  };

  // Loading & Error states remain the same...
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-10">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="h-10 bg-gray-200 rounded mb-3" />
            <div className="h-28 bg-gray-200 rounded mb-3" />
            <div className="h-10 bg-gray-200 rounded mb-3" />
            <div className="h-10 bg-gray-200 rounded mb-3" />
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-10">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-red-600 font-semibold text-lg mb-2">
              Failed to load course
            </p>
            <p className="text-gray-600 text-sm mb-6">
              {error?.data?.message || "Please try again."}
            </p>
            <button
              onClick={refetch}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-10">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-900 font-semibold text-lg mb-2">
              Course not found
            </p>
            <p className="text-gray-600 text-sm mb-6">
              This course may not exist or it may not belong to you.
            </p>
            <Link
              to="/mycourse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black"
            >
              <ArrowLeft size={16} />
              Back to My Courses
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-10 px-6 mt-24">
        <div className="max-w-4xl mx-auto">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <Link
                to="/mycourse"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                Edit Course
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Update your course details and publish when ready.
              </p>
            </div>

            <button
              form="edit-course-form"
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Form */}
          <form
            id="edit-course-form"
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow p-6 sm:p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Course Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Enter course title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={5}
                placeholder="Write course description"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Duration (hours)
                </label>
                <input
                  name="course_duration"
                  type="number"
                  min="0"
                  value={form.course_duration}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Course Type
                </label>
                <select
                  name="course_type"
                  value={form.course_type}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="LIVE">LIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Actual Price
                </label>
                <input
                  name="actual_price"
                  type="number"
                  value={form.actual_price}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Discount Price
                </label>
                <input
                  name="discount_price"
                  type="number"
                  value={form.discount_price}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Published */}
            <div className="flex items-center gap-3">
              <input
                id="is_published"
                name="is_published"
                type="checkbox"
                checked={form.is_published}
                onChange={onChange}
                className="h-5 w-5"
              />
              <label htmlFor="is_published" className="text-sm text-gray-800">
                Publish this course (visible to students)
              </label>
              <span
                className={`ml-auto text-xs px-3 py-1 rounded-full font-bold ${
                  form.is_published
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {form.is_published ? "Published" : "Draft"}
              </span>
            </div>

            {/* === Certificate Settings === */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Certificate Settings</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  name="is_certificate_enabled"
                  checked={form.is_certificate_enabled}
                  onChange={onChange}
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium text-gray-800">
                  Enable Certificate Generation
                </span>
              </div>

              {form.is_certificate_enabled && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Certificate Text / Content
                  </label>
                  <textarea
                    name="certificate_text"
                    value={form.certificate_text}
                    onChange={onChange}
                    rows={4}
                    placeholder="Enter custom text to appear on the certificate (e.g., completion message, instructor signature, etc.)"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This text will be displayed on the generated certificate.
                  </p>
                </div>
              )}
            </div>

            {/* Images Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Course Images
                </label>
                <span className="text-xs text-gray-500">
                  Upload image (max 5)
                </span>
              </div>

              <label className="block cursor-pointer">
                <div className="w-full rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center hover:border-emerald-400 transition">
                  {uploadingImage ? (
                    <p className="text-emerald-600 font-semibold">
                      Uploading...
                    </p>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-700">
                        Click to upload course image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP recommended
                      </p>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingImage}
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                />
              </label>

              {form.images?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {form.images.map((img, idx) => (
                    <div
                      key={`${img}-${idx}`}
                      className="border border-gray-200 rounded-2xl overflow-hidden"
                    >
                      <div className="aspect-[16/9] bg-gray-100">
                        <img
                          src={img}
                          alt={`course-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-gray-600 truncate">{img}</p>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-3">
                  No images uploaded yet.
                </p>
              )}
            </div>

            {/* Mobile submit */}
            <div className="pt-2 sm:hidden">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCourse;