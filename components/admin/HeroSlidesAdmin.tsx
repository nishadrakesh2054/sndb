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

  const openEditForm = (row: HeroSlide) => {
    setForm({ id: row.id, title: row.title, image: row.image });
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
          imagePath = await uploadSiteMedia("hero", imageFile);
        } else if (!editing || !imagePath) {
          throw new Error("Please choose an image file to upload.");
        }
      } else if (!imagePath) {
        throw new Error("Please enter an image URL or path.");
      }

      const supabase = createClient();
      const now = new Date().toISOString();
      const payload = {
        id: form.id || crypto.randomUUID().replace(/-/g, "").slice(0, 24),
        title: form.title.trim(),
        image: imagePath,
        updated_at: now,
      };

      const { error } = editing
        ? await supabase.from("hero_slides").update(payload).eq("id", form.id)
        : await supabase.from("hero_slides").insert({
            ...payload,
            created_at: now,
          });

      if (error) {
        throw error;
      }

      setMessage({ type: "success", text: editing ? "Slide updated." : "Slide created." });
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save slide.",
      });
    } finally {
      setSaving(false);
    }
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
    if (form.id === id) {
      resetForm();
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Hero Slides"
        description="Homepage carousel images and titles. Newest slides appear first (max 3 shown)."
        action={
          !showForm ? (
            <button type="button" onClick={openAddForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Slide
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showForm ? (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit Slide" : "Add Slide"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Image</label>
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
                {saving ? "Saving..." : editing ? "Update Slide" : "Create Slide"}
              </button>
              <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                Cancel
              </button>
            </div>
          </form>
        </AdminCard>
        </div>
      ) : null}

      <AdminCard title={`All Slides (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No slides yet.</p>
            <button type="button" onClick={openAddForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add your first slide
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:h-20 sm:w-36">
                  <img
                    src={getMediaUrl(row.image)}
                    alt={row.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{row.title}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${row.title}`}
                    title="Edit slide"
                    className={btnIconClass}
                    onClick={() => openEditForm(row)}
                  >
                    <FaPen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${row.title}`}
                    title="Delete slide"
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
