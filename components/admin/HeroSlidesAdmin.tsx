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

type HeroSlide = {
  id: string;
  title: string;
  image: string;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  id: "",
  title: "",
  image: "",
};

export default function HeroSlidesAdmin() {
  const [rows, setRows] = useState<HeroSlide[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as HeroSlide[]);
    }
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
      id: form.id || crypto.randomUUID().replace(/-/g, "").slice(0, 24),
      title: form.title.trim(),
      image: form.image.trim(),
      created_at: editing ? undefined : now,
      updated_at: now,
    };

    const { error } = editing
      ? await supabase.from("hero_slides").update(payload).eq("id", form.id)
      : await supabase.from("hero_slides").insert({
          ...payload,
          created_at: now,
        });

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: editing ? "Slide updated." : "Slide created." });
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero slide?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: "Slide deleted." });
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Hero Slides"
        description="Homepage carousel images and titles. Newest slides appear first (max 3 shown)."
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title={editing ? "Edit Slide" : "Add Slide"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Image path</label>
              <input
                required
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/uploads/hero/example.jpg"
                className={inputClass}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
              {editing ? (
                <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </AdminCard>

        <AdminCard title="All Slides">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-500">No slides yet.</p>
          ) : (
            <AdminTable headers={["Title", "Image", "Actions"]}>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-3 font-medium text-gray-900">{row.title}</td>
                  <td className="px-3 py-3 text-gray-600">{row.image}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={btnSecondaryClass}
                        onClick={() => {
                          setForm({ id: row.id, title: row.title, image: row.image });
                          setEditing(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={btnDangerClass}
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </button>
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
