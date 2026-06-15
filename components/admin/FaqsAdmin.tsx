"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import {
  AdminAlert,
  AdminCard,
  AdminPageHeader,
} from "@/components/admin/AdminUi";
import {
  btnIconClass,
  btnIconDangerClass,
  btnPrimaryClass,
  btnSecondaryClass,
  inputClass,
  labelClass,
} from "@/lib/admin/config";
import { createClient } from "@/utils/supabase/client";

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

const emptyForm = {
  id: "",
  question: "",
  answer: "",
  sort_order: "",
  is_active: true,
};

export default function FaqsAdmin() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as FaqRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(false);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm({
      ...emptyForm,
      sort_order: String(rows.length + 1),
    });
    setEditing(false);
    setShowForm(true);
    setMessage(null);
  };

  const openEditForm = (row: FaqRow) => {
    setForm({
      id: row.id,
      question: row.question,
      answer: row.answer,
      sort_order: String(row.sort_order ?? 0),
      is_active: row.is_active,
    });
    setEditing(true);
    setShowForm(true);
    setMessage(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: Number(form.sort_order || 0),
        is_active: form.is_active,
      };

      const supabase = createClient();
      const { error } = editing
        ? await supabase.from("faqs").update(payload).eq("id", form.id)
        : await supabase.from("faqs").insert(payload);

      if (error) throw error;

      setMessage({ type: "success", text: editing ? "FAQ updated." : "FAQ added." });
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save FAQ.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "FAQ deleted." });
    if (form.id === id) resetForm();
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on the About page."
        action={
          !showForm ? (
            <button type="button" onClick={openAddForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add FAQ
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showForm ? (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit FAQ" : "Add FAQ"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Question</label>
                <input
                  required
                  value={form.question}
                  onChange={(event) => setForm({ ...form, question: event.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Answer</label>
                <textarea
                  required
                  value={form.answer}
                  onChange={(event) => setForm({ ...form, answer: event.target.value })}
                  rows={4}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Sort order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(event) =>
                      setForm({ ...form, sort_order: event.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(event) =>
                        setForm({ ...form, is_active: event.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                    />
                    Show on About page
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={saving} className={btnPrimaryClass}>
                  {saving ? "Saving..." : editing ? "Update FAQ" : "Add FAQ"}
                </button>
                <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                  Cancel
                </button>
              </div>
            </form>
          </AdminCard>
        </div>
      ) : null}

      <AdminCard title={`All FAQs (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No FAQs yet.</p>
            <button type="button" onClick={openAddForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add your first FAQ
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Question
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Answer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-gray-50/80">
                    <td className="whitespace-nowrap px-4 py-4 align-top font-medium text-gray-700">
                      {row.sort_order}
                    </td>
                    <td className="max-w-xs px-4 py-4 align-top font-semibold text-gray-900">
                      {row.question}
                    </td>
                    <td className="max-w-md px-4 py-4 align-top text-gray-600">
                      <p className="line-clamp-2">{row.answer}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          row.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600",
                        ].join(" ")}
                      >
                        {row.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${row.question}`}
                          title="Edit FAQ"
                          className={btnIconClass}
                          onClick={() => openEditForm(row)}
                        >
                          <FaPen className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${row.question}`}
                          title="Delete FAQ"
                          className={btnIconDangerClass}
                          onClick={() => handleDelete(row.id)}
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
