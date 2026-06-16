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
  slugify,
} from "@/lib/admin/config";
import { getMediaUrl } from "@/lib/mediaUrl";
import { uploadSiteMedia } from "@/utils/supabase/mediaUpload";
import { revalidateNoticeContent } from "@/lib/admin/revalidateSite";
import { createClient } from "@/utils/supabase/client";

type Notice = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  image_url: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
};

const emptyForm = {
  id: "",
  title: "",
  content: "",
  image_url: "",
  published: true,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
};

const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusClass = (status: Notice["status"]) => {
  if (status === "published") return "bg-green-100 text-green-800";
  if (status === "archived") return "bg-gray-100 text-gray-600";
  return "bg-amber-100 text-amber-800";
};

function formatKeywords(keywords: string[] | null | undefined): string {
  return keywords?.join(", ") ?? "";
}

function parseKeywords(value: string): string[] {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function resolveSeoText(custom: string, fallback: string): string {
  const trimmed = custom.trim();
  return trimmed || fallback;
}

export default function NoticesAdmin() {
  const [rows, setRows] = useState<Notice[]>([]);
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
      .from("notices")
      .select(
        "id, title, slug, content, image_url, status, published_at, created_at, meta_title, meta_description, meta_keywords, og_title, og_description"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as Notice[]);
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

  const openEditForm = (row: Notice) => {
    setForm({
      id: row.id,
      title: row.title,
      content: row.content ?? "",
      image_url: row.image_url,
      published: row.status === "published",
      meta_title: row.meta_title ?? "",
      meta_description: row.meta_description ?? "",
      meta_keywords: formatKeywords(row.meta_keywords),
      og_title: row.og_title ?? "",
      og_description: row.og_description ?? "",
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
      let imagePath = form.image_url.trim();

      if (imageMode === "upload") {
        if (imageFile) {
          imagePath = await uploadSiteMedia("notices", imageFile);
        } else if (!editing || !imagePath) {
          throw new Error("Please choose an image to upload.");
        }
      } else if (!imagePath) {
        throw new Error("Please enter an image URL or path.");
      }

      const title = form.title.trim();
      const content = form.content.trim();
      const excerpt = content.slice(0, 200) || null;
      const now = new Date().toISOString();
      const existing = editing ? rows.find((row) => row.id === form.id) : null;
      const slug = existing?.slug ?? slugify(title);

      if (!slug) {
        throw new Error("Title must contain letters or numbers.");
      }

      const publishedAt = form.published
        ? existing?.published_at ?? now
        : null;

      const metaTitle = resolveSeoText(form.meta_title, title);
      const metaDescription = resolveSeoText(
        form.meta_description,
        excerpt ?? title
      );
      const metaKeywords = parseKeywords(form.meta_keywords);
      const ogTitle = resolveSeoText(form.og_title, metaTitle);
      const ogDescription = resolveSeoText(
        form.og_description,
        (excerpt ?? content).slice(0, 200)
      );

      if (metaDescription.length > 160) {
        throw new Error("Meta description must be 160 characters or fewer.");
      }

      if (ogDescription.length > 200) {
        throw new Error("Social description must be 200 characters or fewer.");
      }

      const payload = {
        title,
        slug,
        content: content || null,
        excerpt,
        image_url: imagePath,
        image_alt: title,
        show_in_popup: false,
        status: form.published ? ("published" as const) : ("draft" as const),
        published_at: publishedAt,
        sort_order: 0,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: imagePath,
      };

      const supabase = createClient();
      const { error } = editing
        ? await supabase.from("notices").update(payload).eq("id", form.id)
        : await supabase.from("notices").insert(payload);

      if (error) {
        throw error;
      }

      await revalidateNoticeContent(slug);

      setMessage({ type: "success", text: editing ? "Notice updated." : "Notice added." });
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save notice.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;

    const deleted = rows.find((row) => row.id === id);
    const supabase = createClient();
    const { error } = await supabase.from("notices").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    await revalidateNoticeContent(deleted?.slug);

    setMessage({ type: "success", text: "Notice deleted." });
    if (form.id === id) {
      resetForm();
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Notices"
        description="Add and publish notices for the notice page."
        action={
          !showForm ? (
            <button type="button" onClick={openAddForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Notice
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showForm ? (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit Notice" : "Add Notice"}>
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
                <label className={labelClass}>Content</label>
                <textarea
                  required
                  value={form.content}
                  onChange={(event) => setForm({ ...form, content: event.target.value })}
                  rows={5}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Image</label>
                <ImageInput
                  mode={imageMode}
                  onModeChange={setImageMode}
                  urlValue={form.image_url}
                  onUrlChange={(value) => setForm({ ...form, image_url: value })}
                  file={imageFile}
                  onFileChange={setImageFile}
                  existingPath={editing ? form.image_url : ""}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) =>
                    setForm({ ...form, published: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
                Publish on site
              </label>

              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">SEO &amp; search</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank to use the notice title and content summary.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Meta title</label>
                  <input
                    value={form.meta_title}
                    onChange={(event) =>
                      setForm({ ...form, meta_title: event.target.value })
                    }
                    placeholder={form.title || "Uses notice title if empty"}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Meta description</label>
                  <textarea
                    value={form.meta_description}
                    onChange={(event) =>
                      setForm({ ...form, meta_description: event.target.value })
                    }
                    rows={2}
                    maxLength={160}
                    placeholder="Short description for search engines"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Keywords</label>
                  <input
                    value={form.meta_keywords}
                    onChange={(event) =>
                      setForm({ ...form, meta_keywords: event.target.value })
                    }
                    placeholder="SNDB, notice, healthcare (comma-separated)"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Social share title</label>
                  <input
                    value={form.og_title}
                    onChange={(event) =>
                      setForm({ ...form, og_title: event.target.value })
                    }
                    placeholder="Uses meta title if empty"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Social share description</label>
                  <textarea
                    value={form.og_description}
                    onChange={(event) =>
                      setForm({ ...form, og_description: event.target.value })
                    }
                    rows={2}
                    maxLength={200}
                    placeholder="Uses content summary if empty"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={saving} className={btnPrimaryClass}>
                  {saving ? "Saving..." : editing ? "Update Notice" : "Add Notice"}
                </button>
                <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                  Cancel
                </button>
              </div>
            </form>
          </AdminCard>
        </div>
      ) : null}

      <AdminCard title={`All Notices (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No notices yet.</p>
            <button type="button" onClick={openAddForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add your first notice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Published
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-gray-50/80">
                    <td className="px-4 py-4 align-top">
                      <div className="h-14 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={getMediaUrl(row.image_url)}
                          alt={row.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-4 align-top">
                      <p className="font-semibold text-gray-900">{row.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {row.content}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 align-top text-gray-500">
                      {formatDate(row.published_at ?? row.created_at)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${row.title}`}
                          title="Edit notice"
                          className={btnIconClass}
                          onClick={() => openEditForm(row)}
                        >
                          <FaPen className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${row.title}`}
                          title="Delete notice"
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
