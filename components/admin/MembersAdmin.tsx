"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";
import ImageInput, { type ImageInputMode } from "@/components/admin/ImageInput";
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
import { getMediaUrl } from "@/lib/mediaUrl";
import { uploadSiteMedia } from "@/utils/supabase/mediaUpload";
import { createClient } from "@/utils/supabase/client";

type Member = {
  id: string;
  title: string;
  image: string;
  position: string;
  phone: number | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  id: "",
  title: "",
  image: "",
  position: "",
  phone: "",
  email: "",
};

export default function MembersAdmin() {
  const [rows, setRows] = useState<Member[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageMode, setImageMode] = useState<ImageInputMode>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as Member[]);
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
    setImageMode("upload");
    setImageFile(null);
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditing(false);
    setImageMode("upload");
    setImageFile(null);
    setShowForm(true);
    setMessage(null);
  };

  const openEditForm = (row: Member) => {
    setForm({
      id: row.id,
      title: row.title,
      image: row.image,
      position: row.position,
      phone: row.phone != null ? String(row.phone) : "",
      email: row.email ?? "",
    });
    setEditing(true);
    setImageMode("url");
    setImageFile(null);
    setShowForm(true);
    setMessage(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let imagePath = form.image.trim();

      if (imageMode === "upload") {
        if (imageFile) {
          imagePath = await uploadSiteMedia("members", imageFile);
        } else if (!editing || !imagePath) {
          throw new Error("Please choose a photo to upload.");
        }
      } else if (!imagePath) {
        throw new Error("Please enter a photo URL or path.");
      }

      const phoneValue = form.phone.trim();
      const phone = phoneValue ? Number(phoneValue) : null;

      if (phoneValue && Number.isNaN(phone)) {
        throw new Error("Phone must be a valid number.");
      }

      const supabase = createClient();
      const now = new Date().toISOString();
      const payload = {
        id: form.id || crypto.randomUUID().replace(/-/g, "").slice(0, 24),
        title: form.title.trim(),
        image: imagePath,
        position: form.position.trim(),
        phone,
        email: form.email.trim() || null,
        updated_at: now,
      };

      const { error } = editing
        ? await supabase.from("members").update(payload).eq("id", form.id)
        : await supabase.from("members").insert({ ...payload, created_at: now });

      if (error) {
        throw error;
      }

      setMessage({ type: "success", text: editing ? "Member updated." : "Member added." });
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save member.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this member?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Member deleted." });
    if (form.id === id) {
      resetForm();
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Life Members"
        description="Manage life member profiles shown on the member page."
        action={
          !showForm ? (
            <button type="button" onClick={openAddForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Member
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showForm ? (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit Member" : "Add Member"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Dr. John Doe"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Position</label>
                <input
                  required
                  value={form.position}
                  onChange={(event) => setForm({ ...form, position: event.target.value })}
                  placeholder="President"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    placeholder="9800000000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="name@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Photo</label>
                <ImageInput
                  mode={imageMode}
                  onModeChange={setImageMode}
                  urlValue={form.image}
                  onUrlChange={(value) => setForm({ ...form, image: value })}
                  file={imageFile}
                  onFileChange={setImageFile}
                  existingPath={editing ? form.image : ""}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={saving} className={btnPrimaryClass}>
                  {saving ? "Saving..." : editing ? "Update Member" : "Add Member"}
                </button>
                <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                  Cancel
                </button>
              </div>
            </form>
          </AdminCard>
        </div>
      ) : null}

      <AdminCard title={`All Members (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No members yet.</p>
            <button type="button" onClick={openAddForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add your first member
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                  <img
                    src={getMediaUrl(row.image)}
                    alt={row.title}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{row.title}</p>
                  <p className="text-sm text-gray-600">{row.position}</p>
                  {row.phone || row.email ? (
                    <p className="mt-1 text-xs text-gray-500">
                      {[row.phone, row.email].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${row.title}`}
                    title="Edit member"
                    className={btnIconClass}
                    onClick={() => openEditForm(row)}
                  >
                    <FaPen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${row.title}`}
                    title="Delete member"
                    className={btnIconDangerClass}
                    onClick={() => handleDelete(row.id)}
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
