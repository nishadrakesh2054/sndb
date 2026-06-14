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

type Member = {
  id: string;
  title: string;
  image: string;
  position: string;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

const emptyForm = { id: "", title: "", image: "", position: "", phone: "", email: "" };

export default function MembersAdmin() {
  const [rows, setRows] = useState<Member[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    if (error) setMessage({ type: "error", text: error.message });
    else setRows((data ?? []) as Member[]);
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
      image: form.image.trim(),
      position: form.position.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      updated_at: now,
    };
    const { error } = editing
      ? await supabase.from("members").update(payload).eq("id", form.id)
      : await supabase.from("members").insert({ ...payload, created_at: now });
    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: editing ? "Member updated." : "Member created." });
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Member deleted." });
      load();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Life Members" description="Manage life member profiles shown on the site." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title={editing ? "Edit Member" : "Add Member"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>ID</label>
              <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className={inputClass} disabled={editing} placeholder="Auto-generated if empty" />
            </div>
            <div>
              <label className={labelClass}>Name (title)</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Image</label>
              <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Position</label>
              <input required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
              {editing ? <button type="button" className={btnSecondaryClass} onClick={resetForm}>Cancel</button> : null}
            </div>
          </form>
        </AdminCard>

        <AdminCard title="All Members">
          {loading ? <p className="text-sm text-gray-500">Loading...</p> : rows.length === 0 ? <p className="text-sm text-gray-500">No members yet.</p> : (
            <AdminTable headers={["Name", "Position", "Phone", "Actions"]}>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-3 font-medium text-gray-900">{row.title}</td>
                  <td className="px-3 py-3 text-gray-700">{row.position}</td>
                  <td className="px-3 py-3 text-gray-700">{row.phone ?? "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setForm({
                          id: row.id,
                          title: row.title,
                          image: row.image,
                          position: row.position,
                          phone: row.phone ?? "",
                          email: row.email ?? "",
                        });
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
