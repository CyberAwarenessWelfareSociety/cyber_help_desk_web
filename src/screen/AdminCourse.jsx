"use client";

import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Home/Header";
import {
  useGetClassesByCourseQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from "@/store/api/class";
import { useGetCourseByIdQuery } from "@/store/api/course";
import axios from "axios";
import { toast } from "sonner";
import {
  ChevronDown,
  Play,
  Clock,
  Users,
  Globe,
  Award,
  Plus,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";

// ✅ shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const emptyForm = {
  title: "",
  thumbnail: "",
  class_duration: 0,
  description: "",
  class_type: "NORMAL", // NORMAL | LIVE
  class_start_time: "", // datetime-local
  class_end_time: "", // datetime-local
  passing_percentage: 0,
  order_no: 1,

  retry_enabled: false,
  max_attempts: 1,
  retry_deadline: "", // datetime-local
};

const toDatetimeLocal = (dateVal) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

const AdminClasses = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const { data: courseData } = useGetCourseByIdQuery(courseId, {
    skip: !courseId,
  });

  const {
    data: classData,
    isLoading,
    isError,
    refetch,
  } = useGetClassesByCourseQuery(courseId, { skip: !courseId });

  const [createClass, { isLoading: creating }] = useCreateClassMutation();
  const [updateClass, { isLoading: updating }] = useUpdateClassMutation();
  const [deleteClass, { isLoading: deleting }] = useDeleteClassMutation();

  const course = courseData?.data;
  const classes = classData?.data || [];

  const [openClassId, setOpenClassId] = useState(null);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ✅ upload state
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const toggleAccordion = (classId) => {
    setOpenClassId((prev) => (prev === classId ? null : classId));
  };

  const handleJoinLive = (classId) => {
    navigate(`/live-class/${classId}`);
  };

  const openCreate = () => {
    setMode("create");
    setEditingId(null);

    const nextOrder =
      (classes?.length ? Math.max(...classes.map((c) => c.order_no || 0)) : 0) +
      1;

    setForm({ ...emptyForm, order_no: nextOrder });
    setIsModalOpen(true);
  };

  const openEdit = (cls) => {
    setMode("edit");
    setEditingId(cls.id);

    setForm({
      title: cls.title || "",
      thumbnail: cls.thumbnail || "",
      class_duration: Number(cls.class_duration || 0),
      description: cls.description || "",
      class_type: cls.class_type || "NORMAL",
      class_start_time: toDatetimeLocal(cls.class_start_time),
      class_end_time: toDatetimeLocal(cls.class_end_time),
      passing_percentage: Number(cls.passing_percentage || 0),
      order_no: Number(cls.order_no || 1),

      retry_enabled: !!cls.retry_enabled,
      max_attempts: Number(cls.max_attempts || 1),
      retry_deadline: toDatetimeLocal(cls.retry_deadline),
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ✅ Upload thumbnail and set form.thumbnail to returned URL
  const uploadThumbnail = async (file) => {
    if (!file) return null;

    if (!file.type?.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingThumb(true);

      const res = await axios.post(
        "https://bucket.cyberawareness.ngo/bucket/upload/cybercrime",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ correct response parsing (object, not array)
      const url =
        res?.data?.file?.url || // ✅ your current API
        res?.data?.file?.[0]?.url || // fallback if API ever returns array
        res?.data?.url; // fallback

      if (!url) {
        console.log("Upload response:", res?.data);
        toast.error("Upload failed — no URL returned");
        return null;
      }

      setForm((prev) => ({ ...prev, thumbnail: url }));
      toast.success("Thumbnail uploaded");
      return url;
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err?.response?.data?.message || "Thumbnail upload failed");
      return null;
    } finally {
      setUploadingThumb(false);
    }
  };

  const onPickThumbnail = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow selecting same file again
    await uploadThumbnail(file);
  };

  // ✅ generic input handler (for non-shadcn controlled things)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: checked }));
      return;
    }

    if (
      ["class_duration", "passing_percentage", "order_no", "max_attempts"].includes(
        name
      )
    ) {
      const n = Number(value);
      setForm((p) => ({ ...p, [name]: Number.isFinite(n) ? n : 0 }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!courseId) return "Invalid courseId";
    if (!form.title?.trim()) return "Title is required";
    if (!form.thumbnail?.trim()) return "Thumbnail is required (upload image)";
    if (!form.order_no || form.order_no <= 0) return "Order No must be > 0";
    if (!["NORMAL", "LIVE"].includes(form.class_type))
      return "Invalid class type";
    if (form.retry_enabled && (!form.max_attempts || form.max_attempts < 1))
      return "Max attempts must be >= 1";
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    if (uploadingThumb) {
      toast.error("Please wait — thumbnail is uploading");
      return;
    }

    const payload = {
      course_id: courseId,
      title: form.title.trim(),
      thumbnail: form.thumbnail.trim(),
      class_duration: Number(form.class_duration || 0),
      description: form.description || null,
      class_type: form.class_type,
      class_start_time: form.class_start_time
        ? new Date(form.class_start_time).toISOString()
        : null,
      class_end_time: form.class_end_time
        ? new Date(form.class_end_time).toISOString()
        : null,
      passing_percentage: Number(form.passing_percentage || 0),
      order_no: Number(form.order_no || 1),

      retry_enabled: !!form.retry_enabled,
      max_attempts: Number(form.max_attempts || 1),
      retry_deadline: form.retry_deadline
        ? new Date(form.retry_deadline).toISOString()
        : null,
    };

    try {
      if (mode === "create") {
        await createClass(payload).unwrap();
        toast.success("Class created ✅");
      } else {
        await updateClass({ id: editingId, ...payload }).unwrap();
        toast.success("Class updated ✅");
      }
      closeModal();
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save class");
    }
  };

  const onDelete = async (clsId) => {
    const ok = window.confirm("Delete this class?");
    if (!ok) return;

    try {
      await deleteClass(clsId).unwrap();
      toast.success("Deleted ✅");
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-2xl font-semibold text-gray-700">
          Loading classes...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-2xl font-semibold text-red-600">
          Failed to load classes
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="mt-25" />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Hero */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={course?.images?.[0] || "/placeholder-course.jpg"}
            alt={course?.title || "Course"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10 text-white max-w-5xl">
            <h1 className="text-4xl font-extrabold mb-3 drop-shadow-lg">
              Admin • {course?.title || "Course"}
            </h1>
            <p className="text-lg opacity-90">
              Manage all classes (no restriction).
            </p>

            <div className="flex items-center gap-6 text-base mt-4 opacity-95">
              <span className="flex items-center gap-2">
                <Users size={18} /> {course?.Instructor?.name || "-"}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} /> {course?.course_duration || 0} hrs
              </span>
              <span className="flex items-center gap-2">
                <Globe size={18} /> {course?.course_type || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 -mt-14 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Course Curriculum (Admin)
              </h2>

              <Button onClick={openCreate} className="rounded-2xl">
                <Plus className="mr-2" size={18} />
                Add Class
              </Button>
            </div>

            <div className="divide-y divide-gray-100">
              {classes.map((cls, index) => {
                const isLiveClass = cls.class_type === "LIVE";

                return (
                  <div key={cls.id} className="transition-all duration-300">
                    {/* Accordion Header */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleAccordion(cls.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          toggleAccordion(cls.id);
                      }}
                      className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img
                            src={cls.thumbnail}
                            alt={cls.title}
                            className="w-24 h-20 object-cover rounded-xl shadow-md"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 hover:opacity-100 transition">
                            <Play className="text-white" size={30} fill="white" />
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

                          {isLiveClass && (
                            <p className="text-sm text-gray-600 mt-1">
                              Live:{" "}
                              {cls.class_start_time
                                ? new Date(cls.class_start_time).toLocaleString()
                                : "-"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* ✅ JOIN LIVE BUTTON (ADMIN) */}
                        {isLiveClass && (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleJoinLive(cls.id);
                            }}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                            title="Join Live Class"
                          >
                            <Play className="mr-2" size={18} />
                            Join Live
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEdit(cls);
                          }}
                          title="Edit"
                          className="rounded-xl"
                        >
                          <Pencil size={18} />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(cls.id);
                          }}
                          title="Delete"
                          disabled={deleting}
                          className="rounded-xl"
                        >
                          <Trash2 size={18} />
                        </Button>

                        <ChevronDown
                          size={22}
                          className={`text-gray-500 transition-transform ${
                            openClassId === cls.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {openClassId === cls.id && (
                      <div className="px-8 pb-8">
                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                          <Link to={`/admin-video/${cls.id}`}>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center gap-3 p-4 rounded-xl border hover:border-emerald-500 hover:bg-emerald-50 transition"
                            >
                              <Award className="text-emerald-600" />
                              <div className="text-left">
                                <p className="font-semibold text-gray-800">
                                  Manage Videos
                                </p>
                                <p className="text-sm text-gray-500">
                                  Add / Edit / Delete videos
                                </p>
                              </div>
                            </button>
                          </Link>

                          <Link to={`/admin-question/${cls.id}`}>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center gap-3 p-4 rounded-xl border hover:border-emerald-500 hover:bg-emerald-50 transition"
                            >
                              <Award className="text-emerald-600" />
                              <div className="text-left">
                                <p className="font-semibold text-gray-800">
                                  Manage Question
                                </p>
                                <p className="text-sm text-gray-500">
                                  Add / Edit / Delete questions
                                </p>
                              </div>
                            </button>
                          </Link>

                          <Link to={`/admin-materials/${cls.id}`}>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center gap-3 p-4 rounded-xl border hover:border-blue-500 hover:bg-blue-50 transition"
                            >
                              <Award className="text-blue-600" />
                              <div className="text-left">
                                <p className="font-semibold text-gray-800">
                                  Manage Materials
                                </p>
                                <p className="text-sm text-gray-500">
                                  Notes & downloads
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

              {classes.length === 0 && (
                <div className="p-10 text-center text-gray-600">
                  No classes found. Click <b>Add Class</b>.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅✅✅ SHADCN MODAL (FIT + SCROLLABLE) */}
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogContent
            className="
              p-0 overflow-hidden
              w-[95vw] min-w-2xl
              max-h-[85vh]
              rounded-3xl
            "
          >
            {/* Sticky Header */}
            <DialogHeader className="px-6 py-4 border-b bg-white sticky top-0 z-10">
              <DialogTitle className="text-xl font-bold">
                {mode === "create" ? "Create Class" : "Edit Class"}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Body */}
            <ScrollArea className="max-h-[calc(85vh-140px)]">
              <div className="px-6 py-5 grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Title *</Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Class title"
                  />
                </div>

                {/* Thumbnail Upload */}
                <div className="md:col-span-2 space-y-2">
                  <Label>Thumbnail *</Label>

                  <div className="flex items-center gap-4">
                    <div className="w-28 h-20 rounded-xl border bg-muted overflow-hidden flex items-center justify-center">
                      {form.thumbnail ? (
                        <img
                          src={form.thumbnail}
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No image
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <input
                        id="thumbUpload"
                        type="file"
                        accept="image/*"
                        onChange={onPickThumbnail}
                        disabled={uploadingThumb}
                        className="hidden"
                      />

                      <Label
                        htmlFor="thumbUpload"
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-xl border text-sm font-semibold cursor-pointer
                        ${
                          uploadingThumb
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-accent"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {uploadingThumb ? "Uploading..." : "Choose Image"}
                      </Label>

                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm((p) => ({ ...p, thumbnail: "" }));
                        }}
                        disabled={!form.thumbnail || uploadingThumb}
                      >
                        Remove
                      </Button>

                      {!form.thumbnail && (
                        <span className="text-xs text-muted-foreground">
                          Upload an image to set the thumbnail.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Class Type *</Label>
                  <Select
                    value={form.class_type}
                    onValueChange={(v) => setForm((p) => ({ ...p, class_type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORMAL">NORMAL</SelectItem>
                      <SelectItem value="LIVE">LIVE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duration (mins)</Label>
                  <Input
                    type="number"
                    name="class_duration"
                    value={form.class_duration}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Time (LIVE)</Label>
                  <Input
                    type="datetime-local"
                    name="class_start_time"
                    value={form.class_start_time}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Time (LIVE)</Label>
                  <Input
                    type="datetime-local"
                    name="class_end_time"
                    value={form.class_end_time}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Passing %</Label>
                  <Input
                    type="number"
                    name="passing_percentage"
                    value={form.passing_percentage}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Order No *</Label>
                  <Input
                    type="number"
                    name="order_no"
                    value={form.order_no}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="min-h-[110px]"
                    placeholder="Optional description..."
                  />
                </div>

                <Separator className="md:col-span-2" />

                {/* Retry Settings */}
                <div className="md:col-span-2 rounded-2xl border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">Retry Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Enable attempts/retest rules.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={form.retry_enabled}
                        onCheckedChange={(v) =>
                          setForm((p) => ({ ...p, retry_enabled: !!v }))
                        }
                      />
                      <span className="text-sm font-semibold">Enabled</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Max Attempts</Label>
                      <Input
                        type="number"
                        name="max_attempts"
                        value={form.max_attempts}
                        onChange={handleChange}
                        min={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Retry Deadline</Label>
                      <Input
                        type="datetime-local"
                        name="retry_deadline"
                        value={form.retry_deadline}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Sticky Footer */}
            <DialogFooter className="px-6 py-4 border-t bg-white sticky bottom-0 z-10">
              <div className="flex w-full justify-end gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={closeModal}
                >
                  Cancel
                </Button>

                <Button
                  className="rounded-2xl"
                  onClick={onSubmit}
                  disabled={creating || updating || uploadingThumb}
                >
                  <Save className="mr-2" size={18} />
                  {creating || updating
                    ? "Saving..."
                    : uploadingThumb
                    ? "Uploading..."
                    : "Save"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminClasses;
