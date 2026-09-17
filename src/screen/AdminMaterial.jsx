"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Home/Header";
import {
  useGetMaterialsByClassQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} from "@/store/api/class-material";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ExternalLink,
  FileText,
  ImageIcon,
  Video,
  Music,
  File as FileIcon,
} from "lucide-react";

const emptyForm = {
  title: "",
  material_type: "PDF", // VIDEO | PDF | IMAGE | AUDIO | OTHER
  url: "",
};

const AdminMaterial = () => {
  const { id: classId } = useParams();

  // ✅ fetch materials
  const {
    data: res,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMaterialsByClassQuery(classId, { skip: !classId });

  // ✅ RTK response: { data: [...] } OR direct []
  const materials = useMemo(() => {
    const d = res?.data ?? res ?? [];
    return Array.isArray(d) ? d : [];
  }, [res]);

  const [createMaterial, { isLoading: creating }] = useCreateMaterialMutation();
  const [updateMaterial, { isLoading: updating }] = useUpdateMaterialMutation();
  const [deleteMaterial, { isLoading: deleting }] = useDeleteMaterialMutation();

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // upload
  const [uploadingFile, setUploadingFile] = useState(false);

  const getMaterialIcon = (type = "") => {
    const t = String(type).toUpperCase();
    if (t === "IMAGE") return <ImageIcon size={26} className="text-blue-600" />;
    if (t === "VIDEO") return <Video size={26} className="text-red-600" />;
    if (t === "AUDIO") return <Music size={26} className="text-purple-600" />;
    if (t === "PDF") return <FileText size={26} className="text-orange-600" />;
    return <FileIcon size={26} className="text-gray-600" />;
  };

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (m) => {
    setMode("edit");
    setEditingId(m.id);
    setForm({
      title: m.title || "",
      material_type: m.material_type || "PDF",
      url: m.url || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const validate = () => {
    if (!classId) return "Invalid class id";
    if (!form.title?.trim()) return "Title is required";
    if (!form.material_type) return "Material type is required";
    if (!form.url?.trim()) return "Please upload a file";
    return null;
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ✅ Upload any file and set form.url with returned URL
  const uploadMaterialFile = async (file) => {
    if (!file) return null;

    // Optional: size limit
    // const maxMB = 25;
    // if (file.size > maxMB * 1024 * 1024) {
    //   toast.error(`Max file size ${maxMB}MB`);
    //   return null;
    // }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingFile(true);

      const res = await axios.post(
        "https://bucket.cyberawareness.ngo/bucket/upload/cybercrime",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

     const url =
      res?.data?.file?.url ||                 // ✅ your current API
      res?.data?.file?.[0]?.url ||            // fallback if API ever returns array
      res?.data?.url;   
      if (!url) {
        toast.error("Upload failed — no URL returned");
        return null;
      }

      setForm((p) => ({ ...p, url }));
      toast.success("File uploaded");
      return url;
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err?.response?.data?.message || "File upload failed");
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    await uploadMaterialFile(file);
  };

  // Optional: auto suggest type by file extension
  useEffect(() => {
    if (!form.url) return;
    const u = form.url.toLowerCase();
    if (u.endsWith(".pdf")) setForm((p) => ({ ...p, material_type: "PDF" }));
    else if (u.match(/\.(png|jpg|jpeg|webp|gif)$/))
      setForm((p) => ({ ...p, material_type: "IMAGE" }));
    else if (u.match(/\.(mp4|mov|mkv|webm)$/))
      setForm((p) => ({ ...p, material_type: "VIDEO" }));
    else if (u.match(/\.(mp3|wav|ogg|m4a)$/))
      setForm((p) => ({ ...p, material_type: "AUDIO" }));
  }, [form.url]);

  const onSubmit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    if (uploadingFile) {
      toast.error("Please wait — file is uploading");
      return;
    }

    const payload = {
      class_id: classId,
      title: form.title.trim(),
      material_type: form.material_type,
      url: form.url.trim(),
    };

    try {
      if (mode === "create") {
        await createMaterial(payload).unwrap();
        toast.success("Material created ✅");
      } else {
        await updateMaterial({ id: editingId, ...payload }).unwrap();
        toast.success("Material updated ✅");
      }
      closeModal();
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save material");
    }
  };

  const onDelete = async (materialId) => {
    const ok = window.confirm("Delete this material?");
    if (!ok) return;

    try {
      await deleteMaterial(materialId).unwrap();
      toast.success("Deleted ✅");
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-lg text-gray-600 animate-pulse">
            Loading materials...
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center text-red-600">
          <div className="text-center">
            <p className="text-lg font-medium">Failed to load materials</p>
            <p className="text-sm mt-2">
              {error?.data?.message || "Please try again later"}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mt-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin • Class Materials
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Create / edit / delete materials for this class.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
          >
            <Plus size={18} />
            Add Material
          </button>
        </div>

        {/* List */}
        <div className="mt-8 bg-white rounded-3xl border shadow-sm overflow-hidden">
          {materials.length === 0 ? (
            <div className="p-10 text-center text-gray-600">
              No materials yet. Click <b>Add Material</b>.
            </div>
          ) : (
            <div className="divide-y">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl border bg-gray-50 flex items-center justify-center">
                      {getMaterialIcon(m.material_type)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">{m.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="px-2 py-1 rounded-full bg-gray-100 font-semibold">
                          {m.material_type}
                        </span>
                        <span>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                      </div>

                      {m.url && (
                        <button
                          onClick={() => openInNewTab(m.url)}
                          className="mt-2 inline-flex items-center gap-2 text-sm text-blue-700 hover:underline"
                        >
                          <ExternalLink size={16} />
                          Open
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(m)}
                      className="px-3 py-2 rounded-xl border hover:bg-blue-50"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(m.id)}
                      className="px-3 py-2 rounded-xl border hover:bg-red-50"
                      title="Delete"
                      disabled={deleting}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border overflow-hidden pointer-events-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {mode === "create" ? "Add Material" : "Edit Material"}
              </h3>

              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <X />
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full mt-1 p-3 rounded-xl border"
                  placeholder="Material title"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Type *
                </label>
                <select
                  name="material_type"
                  value={form.material_type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, material_type: e.target.value }))
                  }
                  className="w-full mt-1 p-3 rounded-xl border"
                >
                  <option value="PDF">PDF</option>
                  <option value="IMAGE">IMAGE</option>
                  <option value="VIDEO">VIDEO</option>
                  <option value="AUDIO">AUDIO</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              {/* ✅ Upload + URL output */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Upload File *
                </label>

                <input
                  id="materialUpload"
                  type="file"
                  onChange={onPickFile}
                  disabled={uploadingFile}
                  className="hidden"
                />

                <label
                  htmlFor="materialUpload"
                  className={`mt-1 inline-flex items-center justify-center w-full px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer
                  ${
                    uploadingFile
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {uploadingFile ? "Uploading..." : "Choose File"}
                </label>

                {form.url ? (
                  <button
                    type="button"
                    onClick={() => openInNewTab(form.url)}
                    className="mt-2 text-sm text-blue-700 hover:underline inline-flex items-center gap-2"
                  >
                    <ExternalLink size={16} /> Preview uploaded file
                  </button>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a file to generate URL automatically.
                  </p>
                )}
              </div>

              {/* Show URL (read-only) */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  File URL (auto)
                </label>
                <input
                  value={form.url}
                  readOnly
                  className="w-full mt-1 p-3 rounded-xl border bg-gray-50 text-gray-600"
                  placeholder="URL will appear after upload..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-3 rounded-2xl border hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={onSubmit}
                disabled={creating || updating || uploadingFile}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                <Save size={18} />
                {creating || updating
                  ? "Saving..."
                  : uploadingFile
                  ? "Uploading..."
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMaterial;
