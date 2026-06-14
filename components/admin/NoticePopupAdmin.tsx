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

type NoticePopup = {
  id: string;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const emptyForm = { id: "", image: "", is_active: false };

export default function NoticePopupAdmin() {
  const [rows, setRows] = useState<NoticePopup[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("notice_popups").select("*").order("created_at", { ascending: false });
    if (error) setMessage({ type: "error", text: error.message });
    else setRows((data ?? []) as NoticePopup[]);
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
    const payload = { image: form.image.trim(), is_active: form.is_active };
    const { error } = editing
      ? await supabase.from("notice_popups").update(payload).eq("id", form.id)
      : await supabase.from("notice_popups").insert(payload);
    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: editing ? "Popup updated." : "Popup created." });
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice popup?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("notice_popups").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Popup deleted." });
      load();
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Notice Popup"
        description="Manage homepage notice popup images and active state."
      />
      <p className="mb-4 text-sm text-amber-700">Only active popups are shown on the public site.</p>
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title={editing ? "Edit Popup" : "Add Popup"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Image path</label>
              <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Active
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
              {editing ? <button type="button" className={btnSecondaryClass} onClick={resetForm}>Cancel</button> : null}
            </div>
          </form>
        </AdminCard>

        <AdminCard title="All Popups">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-500">No popups yet.</p>
          ) : (
            <AdminTable headers={["Image", "Active", "Actions"]}>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-3 text-gray-700">{row.image}</td>
                  <td className="px-3 py-3">{row.is_active ? "Yes" : "No"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setForm({ id: row.id, image: row.image, is_active: row.is_active });
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
