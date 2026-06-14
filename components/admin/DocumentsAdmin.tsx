"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminAlert,
  AdminCard,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUi";
import {
  btnDangerClass,
  btnPrimaryClass,
  btnSecondaryClass,
  inputClass,
  labelClass,
} from "@/lib/admin/config";
import { createClient } from "@/utils/supabase/client";

type DocumentRow = {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
  updated_at: string;
};

const emptyForm = { id: "", title: "", file_path: "" };

export default function DocumentsAdmin() {
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (error) setMessage({ type: "error", text: error.message });
    else setRows((data ?? []) as DocumentRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const now = new Date().toISOString();
    const payload = {
      id: form.id.trim() || crypto.randomUUID().replace(/-/g, "").slice(0, 24),
      title: form.title.trim(),
      file_path: form.file_path.trim(),
      updated_at: now,
    };

    const { error } = editing
      ? await supabase.from("documents").update(payload).eq("id", form.id)
      : await supabase.from("documents").insert({ ...payload, created_at: now });

    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: editing ? "Document updated." : "Document created." });
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Document deleted." });
      load();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Documents" description="Manage downloadable document records." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title={editing ? "Edit Document" : "Add Document"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>ID</label>
              <input
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                className={inputClass}
                placeholder="Auto-generated if empty"
                disabled={editing}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>File path</label>
              <input required value={form.file_path} onChange={(e) => setForm({ ...form, file_path: e.target.value })} className={inputClass} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
              {editing ? (
                <button type="button" className={btnSecondaryClass} onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </AdminCard>

        <AdminCard title="All Documents">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-500">No documents yet.</p>
          ) : (
            <AdminTable headers={["Title", "File", "Actions"]}>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-3 font-medium text-gray-900">{row.title}</td>
                  <td className="px-3 py-3 text-gray-600">{row.file_path}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setForm({ id: row.id, title: row.title, file_path: row.file_path });
                        setEditing(true);
                      }}>Edit</button>
                      <button type="button" className={btnDangerClass} onClick={() => handleDelete(row.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
