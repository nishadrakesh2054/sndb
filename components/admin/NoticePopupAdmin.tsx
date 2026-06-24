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
import { revalidateNoticeContent } from "@/lib/admin/revalidateSite";
import { getMediaUrl } from "@/lib/mediaUrl";
import { uploadSiteMedia } from "@/utils/supabase/mediaUpload";
import { createClient } from "@/utils/supabase/client";

type NoticePopup = {
  id: string;
  image: string;
  link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const emptyForm = { id: "", image: "", link: "", is_active: false };

const normalizeLink = (link: string) => {
  const trimmed = link.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export default function NoticePopupAdmin() {
  const [rows, setRows] = useState<NoticePopup[]>([]);
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
      .from("notice_popups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as NoticePopup[]);
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

  const openEditForm = (row: NoticePopup) => {
    setForm({
      id: row.id,
      image: row.image,
      link: row.link ?? "",
      is_active: row.is_active,
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
          imagePath = await uploadSiteMedia("notice-popup", imageFile);
        } else if (!editing || !imagePath) {
          throw new Error("Please choose an image file to upload.");
        }
      } else if (!imagePath) {
        throw new Error("Please enter an image URL or path.");
      }

      const supabase = createClient();
      const payload = {
        image: imagePath,
        link: normalizeLink(form.link),
        is_active: form.is_active,
      };
      const { error } = editing
        ? await supabase.from("notice_popups").update(payload).eq("id", form.id)
        : await supabase.from("notice_popups").insert(payload);

      if (error) {
        throw error;
      }

      await revalidateNoticeContent();

      setMessage({ type: "success", text: editing ? "Popup updated." : "Popup created." });
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save popup.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice popup?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("notice_popups").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    await revalidateNoticeContent();

    setMessage({ type: "success", text: "Popup deleted." });
    if (form.id === id) {
      resetForm();
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Notice Popup"
        description="Manage homepage notice popup images, redirect links, and active state."
        action={
          !showForm ? (
            <button type="button" onClick={openAddForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Popup
            </button>
          ) : null
        }
      />

      <p className="mb-4 text-sm text-amber-700">
        Only active popups are shown on the public site.
      </p>

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showForm ? (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit Popup" : "Add Popup"}>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className={labelClass}>Link (optional)</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(event) =>
                    setForm({ ...form, link: event.target.value })
                  }
                  placeholder="/gallery"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Page path or full URL. Clicking the popup image opens this link.
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm({ ...form, is_active: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
                Active (show on homepage)
              </label>

              <div className="flex gap-2">
                <button type="submit" disabled={saving} className={btnPrimaryClass}>
                  {saving ? "Saving..." : editing ? "Update Popup" : "Create Popup"}
                </button>
                <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                  Cancel
                </button>
              </div>
            </form>
          </AdminCard>
        </div>
      ) : null}

      <AdminCard title={`All Popups (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No popups yet.</p>
            <button type="button" onClick={openAddForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add your first popup
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:h-24 sm:w-40">
                  <img
                    src={getMediaUrl(row.image)}
                    alt="Notice popup"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      row.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600",
                    ].join(" ")}
                  >
                    {row.is_active ? "Active" : "Inactive"}
                  </span>
                  {row.link ? (
                    <p className="mt-2 truncate text-sm text-gray-600">
                      Link:{" "}
                      <span className="font-medium text-green-700">{row.link}</span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">No link set</p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="Edit popup"
                    title="Edit popup"
                    className={btnIconClass}
                    onClick={() => openEditForm(row)}
                  >
                    <FaPen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete popup"
                    title="Delete popup"
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
