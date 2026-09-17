"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Home/Header";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

import {
  useGetQuestionsByClassQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/store/api/class-question";

const emptyForm = {
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "", // "" | option_a | option_b | option_c | option_d
};

const AdminQuestion = () => {
  const { id: classId } = useParams();

  const {
    data: res,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetQuestionsByClassQuery(classId, { skip: !classId });

  const questions = useMemo(() => {
    const arr = res?.data || [];
    return Array.isArray(arr) ? arr : [];
  }, [res]);

  const [createQuestion, { isLoading: creating }] = useCreateQuestionMutation();
  const [updateQuestion, { isLoading: updating }] = useUpdateQuestionMutation();
  const [deleteQuestion, { isLoading: deleting }] = useDeleteQuestionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (q) => {
    setMode("edit");
    setEditingId(q.id);
    setForm({
      question: q.question || "",
      option_a: q.option_a || "",
      option_b: q.option_b || "",
      option_c: q.option_c || "",
      option_d: q.option_d || "",
      correct_answer: q.correct_answer || "",
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
    if (!form.question?.trim()) return "Question is required";

    // at least 2 options recommended
    const opts = [form.option_a, form.option_b, form.option_c, form.option_d].filter(
      (x) => String(x || "").trim()
    );
    if (opts.length < 2) return "Please fill at least 2 options";

    if (form.correct_answer) {
      const val = form[form.correct_answer];
      if (!String(val || "").trim())
        return "Correct answer must point to a filled option";
    }
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    const payload = {
      class_id: classId,
      question: form.question.trim(),
      option_a: form.option_a?.trim() || null,
      option_b: form.option_b?.trim() || null,
      option_c: form.option_c?.trim() || null,
      option_d: form.option_d?.trim() || null,
      correct_answer: form.correct_answer || null, // allow null
    };

    try {
      if (mode === "create") {
        await createQuestion(payload).unwrap();
        toast.success("Question created ✅");
      } else {
        await updateQuestion({ id: editingId, ...payload }).unwrap();
        toast.success("Question updated ✅");
      }
      closeModal();
      refetch();
    } catch (e) {
      console.error(e);
      toast.error(e?.data?.message || "Save failed");
    }
  };

  const onDelete = async (qid) => {
    const ok = window.confirm("Delete this question?");
    if (!ok) return;

    try {
      await deleteQuestion(qid).unwrap();
      toast.success("Deleted ✅");
      refetch();
    } catch (e) {
      console.error(e);
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-lg text-gray-600 animate-pulse">Loading questions...</div>
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
            <p className="text-lg font-medium">Failed to load questions</p>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin • Class Questions
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Create / edit / delete quiz questions for this class.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>

        <div className="mt-8 bg-white rounded-3xl border shadow-sm overflow-hidden">
          {questions.length === 0 ? (
            <div className="p-10 text-center text-gray-600">
              No questions yet. Click <b>Add Question</b>.
            </div>
          ) : (
            <div className="divide-y">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">
                        {idx + 1}. {q.question}
                      </p>

                      <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                        <p><b>A:</b> {q.option_a || "-"}</p>
                        <p><b>B:</b> {q.option_b || "-"}</p>
                        <p><b>C:</b> {q.option_c || "-"}</p>
                        <p><b>D:</b> {q.option_d || "-"}</p>
                      </div>

                      <p className="mt-3 text-xs text-gray-600">
                        Correct:{" "}
                        <span className="font-semibold">
                          {q.correct_answer || "Not set"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(q)}
                        className="px-3 py-2 rounded-xl border hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(q.id)}
                        className="px-3 py-2 rounded-xl border hover:bg-red-50"
                        title="Delete"
                        disabled={deleting}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border overflow-hidden pointer-events-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {mode === "create" ? "Add Question" : "Edit Question"}
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
                  Question *
                </label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                  className="w-full mt-1 p-3 rounded-xl border min-h-[90px]"
                  placeholder="Write the question..."
                />
              </div>

              {["a", "b", "c", "d"].map((k) => (
                <div key={k}>
                  <label className="text-sm font-semibold text-gray-700">
                    Option {k.toUpperCase()}
                  </label>
                  <input
                    value={form[`option_${k}`]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [`option_${k}`]: e.target.value }))
                    }
                    className="w-full mt-1 p-3 rounded-xl border"
                    placeholder={`Option ${k.toUpperCase()}`}
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Correct Answer (optional)
                </label>
                <select
                  value={form.correct_answer}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, correct_answer: e.target.value }))
                  }
                  className="w-full mt-1 p-3 rounded-xl border"
                >
                  <option value="">Not set</option>
                  <option value="option_a">Option A</option>
                  <option value="option_b">Option B</option>
                  <option value="option_c">Option C</option>
                  <option value="option_d">Option D</option>
                </select>

                <p className="text-xs text-gray-500 mt-2">
                  If you set correct answer, make sure that option has value.
                </p>
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
                disabled={creating || updating}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                <Save size={18} />
                {creating || updating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminQuestion;
