// src/pages/courses/CreateCourse.jsx
import Header from "@/components/Home/Header";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useCreateCourseMutation } from "@/store/api/course";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/reducer/auth";

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const CreateCourse = () => {
  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const userid = useSelector(selectCurrentUser);
  console.log("Current User ID:", userid); // Debugging line

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

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (form.images.length >= 5) {
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const url =
        res?.data?.file?.url ||
        res?.data?.file?.[0]?.url ||
        res?.data?.url;

      if (!url) {
        toast.error("Upload failed");
        return;
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));

      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";

    const actual = toNumber(form.actual_price, NaN);
    const discount = toNumber(form.discount_price, NaN);

    if (!Number.isFinite(actual) || actual < 0)
      return "Actual price must be valid";

    if (!Number.isFinite(discount) || discount < 0)
      return "Discount price must be valid";

    if (discount > actual)
      return "Discount cannot exceed actual price";

    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validate();
    if (errorMsg) return toast.error(errorMsg);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        course_duration: toNumber(form.course_duration, 0),
        course_type: form.course_type,
        actual_price: String(form.actual_price || "0"),
        discount_price: String(form.discount_price || "0"),
        images: form.images,
        is_published: form.is_published,
        instructor_id: userid?.id,
        // === New Certificate Fields ===
        is_certificate_enabled: form.is_certificate_enabled,
        certificate_text: form.certificate_text.trim() || null,
      };

      const res = await createCourse(payload).unwrap();

      toast.success(res?.message || "Course created successfully");
      navigate("/mycourse");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create course");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-10 px-6 mt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link
                to="/mycourse"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
              <h1 className="text-3xl font-bold mt-2">Create New Course</h1>
              <p className="text-sm text-gray-600 mt-1">
                Add details and publish when ready.
              </p>
            </div>

            <button
              form="create-course-form"
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              <Save size={18} />
              {isLoading ? "Creating..." : "Create Course"}
            </button>
          </div>

          {/* Form */}
          <form
            id="create-course-form"
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Course Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className="w-full border rounded-xl px-4 py-3"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={onChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="number"
                name="course_duration"
                placeholder="Duration (hours)"
                value={form.course_duration}
                onChange={onChange}
                className="border rounded-xl px-4 py-3"
              />

              <select
                name="course_type"
                value={form.course_type}
                onChange={onChange}
                className="border rounded-xl px-4 py-3"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="LIVE">LIVE</option>
              </select>

              <input
                type="number"
                name="actual_price"
                placeholder="Actual Price"
                value={form.actual_price}
                onChange={onChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                name="discount_price"
                placeholder="Discount Price"
                value={form.discount_price}
                onChange={onChange}
                className="border rounded-xl px-4 py-3"
              />
            </div>

            {/* Publish */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={onChange}
              />
              <span className="text-sm">Publish course</span>
            </div>

            {/* === New Certificate Section === */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Certificate Settings</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  name="is_certificate_enabled"
                  checked={form.is_certificate_enabled}
                  onChange={onChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">
                  Enable Certificate Generation
                </span>
              </div>

              {form.is_certificate_enabled && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Certificate Text / Content
                  </label>
                  <textarea
                    name="certificate_text"
                    rows={4}
                    value={form.certificate_text}
                    onChange={onChange}
                    placeholder="Enter custom text to appear on the certificate (e.g., course completion message, instructor signature, etc.)"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This text will be displayed on the generated certificate.
                  </p>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Course Images
              </label>

              <label className="block cursor-pointer border border-dashed rounded-xl py-6 text-center">
                {uploadingImage ? (
                  <p>Uploading...</p>
                ) : (
                  <>
                    <ImageIcon className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Click to upload</p>
                  </>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e.target.files?.[0])
                  }
                />
              </label>

              {form.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="border rounded-xl overflow-hidden">
                      <img
                        src={img}
                        alt="course"
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="text-red-600 text-sm p-2 flex items-center gap-1 w-full justify-center"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;