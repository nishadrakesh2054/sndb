"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
import { revalidateHeroContent } from "@/lib/admin/revalidateSite";
import { createClient } from "@/utils/supabase/client";

type HeroSlide = {
  id: string;
  title: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  id: "",
  title: "",
  image: "",
  sort_order: "",
};

function nextSortOrder(rows: HeroSlide[]): number {
  if (rows.length === 0) return 1;
  return Math.max(...rows.map((row) => row.sort_order ?? 0), 0) + 1;
}

function scrollToForm(formRef: React.RefObject<HTMLDivElement | null>) {
  requestAnimationFrame(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export default function HeroSlidesAdmin() {
  const formRef = useRef<HTMLDivElement>(null);
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
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setRows([]);
    } else {
      setRows(
        ((data ?? []) as HeroSlide[]).map((row, index) => ({
          ...row,
          sort_order: row.sort_order ?? index + 1,
        }))
      );
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
    setForm({
      ...emptyForm,
      sort_order: String(nextSortOrder(rows)),
    });
    setEditing(false);
    setImageMode("upload");
    setImageFile(null);
    setShowForm(true);
    setMessage(null);
    scrollToForm(formRef);
  };

  const openEditForm = (row: HeroSlide) => {
    setForm({
      id: row.id,
      title: row.title,
      image: row.image,
      sort_order: String(row.sort_order ?? 1),
    });
    setEditing(true);
    setImageMode("url");
    setImageFile(null);
    setShowForm(true);
    setMessage(null);
    scrollToForm(formRef);
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

      const sortOrder = Number(form.sort_order);
      if (!Number.isFinite(sortOrder) || sortOrder < 0) {
        throw new Error("Display order must be 0 or greater.");
      }

      const supabase = createClient();
      const now = new Date().toISOString();
      const payload = {
        title: form.title.trim(),
        image: imagePath,
        sort_order: sortOrder,
        updated_at: now,
      };

      const { error } = editing
        ? await supabase.from("hero_slides").update(payload).eq("id", form.id)
        : await supabase.from("hero_slides").insert({
            id: crypto.randomUUID().replace(/-/g, "").slice(0, 24),
            ...payload,
            created_at: now,
          });

      if (error) {
        throw error;
      }

      await revalidateHeroContent();
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
    if (!confirm("Delete this hero slide permanently?")) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    if (!data?.length) {
      setMessage({
        type: "error",
        text: "Could not delete slide. Check that you are logged in as admin.",
      });
      return;
    }

    await revalidateHeroContent();
    setMessage({ type: "success", text: "Slide deleted." });
    if (form.id === id) {
      resetForm();
    }
    load();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hero Slides"
        description="Homepage carousel. Set display order: 1 shows first, then 2, 3…"
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
        <div ref={formRef}>
          <AdminCard title={editing ? "Edit Slide" : "Add Slide"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <label className={labelClass}>Display order</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={form.sort_order}
                    onChange={(event) =>
                      setForm({ ...form, sort_order: event.target.value })
                    }
                    className={inputClass}
                    placeholder="1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Lower number = shown first on homepage slider.
                  </p>
                </div>
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
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: 1920 × 1080 px (16:9), important content centered.
                </p>
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
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((row) => {
                  const isEditingRow = editing && form.id === row.id;

                  return (
                    <tr
                      key={row.id}
                      className={[
                        "transition",
                        isEditingRow
                          ? "bg-green-50 ring-2 ring-inset ring-green-400"
                          : "hover:bg-gray-50/80",
                      ].join(" ")}
                    >
                      <td className="whitespace-nowrap px-4 py-4 align-top">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                          {row.sort_order}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="h-14 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <img
                            src={getMediaUrl(row.image)}
                            alt={row.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="max-w-md px-4 py-4 align-top">
                        <p className="font-semibold text-gray-900">{row.title}</p>
                        {isEditingRow ? (
                          <span className="mt-1 inline-flex rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Editing
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            aria-label={`Edit ${row.title}`}
                            title="Edit slide"
                            className={[
                              btnIconClass,
                              isEditingRow ? "border-green-500 bg-green-100 text-green-800" : "",
                            ].join(" ")}
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
