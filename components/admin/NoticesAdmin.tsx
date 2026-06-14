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
  slugify,
} from "@/lib/admin/config";
import { createClient } from "@/utils/supabase/client";

type Notice = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string;
  image_alt: string | null;
  show_in_popup: boolean;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
};

const emptyForm = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  image_alt: "",
  show_in_popup: false,
  status: "draft" as Notice["status"],
  published_at: "",
  sort_order: "0",
  meta_title: "",
  meta_description: "",
};

export default function NoticesAdmin() {
  const [rows, setRows] = useState<Notice[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
    if (error) setMessage({ type: "error", text: error.message });
    else setRows((data ?? []) as Notice[]);
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

    const payload = {
      title: form.title.trim(),
      slug: (form.slug.trim() || slugify(form.title)).trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      image_url: form.image_url.trim(),
      image_alt: form.image_alt.trim() || null,
      show_in_popup: form.show_in_popup,
      status: form.status,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
      sort_order: Number(form.sort_order || 0),
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
    };

    const { error } = editing
      ? await supabase.from("notices").update(payload).eq("id", form.id)
      : await supabase.from("notices").insert(payload);

    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: editing ? "Notice updated." : "Notice created." });
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Notice deleted." });
      load();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Notices" description="Create, publish, and organize notices." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title={editing ? "Edit Notice" : "Add Notice"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                onBlur={() => !editing && !form.slug && setForm((prev) => ({ ...prev, slug: slugify(prev.title) }))}
                className={inputClass}
                placeholder="Auto-generated from title on create"
              />
            </div>
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputClass} rows={4} />
            </div>
            <div>
              <label className={labelClass}>Image URL</label>
              <input required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Image Alt</label>
              <input value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })} className={inputClass} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.show_in_popup} onChange={(e) => setForm({ ...form, show_in_popup: e.target.checked })} />
              Show in popup
            </label>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Notice["status"] })} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Published at</label>
              <input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sort order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Meta title</label>
              <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Meta description</label>
              <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className={inputClass} rows={2} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
              {editing ? <button type="button" onClick={resetForm} className={btnSecondaryClass}>Cancel</button> : null}
            </div>
          </form>
        </AdminCard>

        <AdminCard title="All Notices">
          {loading ? <p className="text-sm text-gray-500">Loading...</p> : rows.length === 0 ? <p className="text-sm text-gray-500">No notices yet.</p> : (
            <AdminTable headers={["Title", "Status", "Popup", "Actions"]}>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-900">{row.title}</p>
                    <p className="text-xs text-gray-500">{row.slug}</p>
                  </td>
                  <td className="px-3 py-3">{row.status}</td>
                  <td className="px-3 py-3">{row.show_in_popup ? "Yes" : "No"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setForm({
                          id: row.id,
                          title: row.title,
                          slug: row.slug,
                          excerpt: row.excerpt ?? "",
                          content: row.content ?? "",
                          image_url: row.image_url,
                          image_alt: row.image_alt ?? "",
                          show_in_popup: row.show_in_popup,
                          status: row.status,
                          published_at: row.published_at ? row.published_at.slice(0, 16) : "",
                          sort_order: String(row.sort_order ?? 0),
                          meta_title: row.meta_title ?? "",
                          meta_description: row.meta_description ?? "",
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
