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
} from "@/lib/admin/config";
import { getMediaUrl } from "@/lib/mediaUrl";
import { revalidateGalleryContent } from "@/lib/admin/revalidateSite";
import { uploadSiteMedia } from "@/utils/supabase/mediaUpload";
import { createClient } from "@/utils/supabase/client";

type GalleryImage = {
  id: string;
  image_url: string;
  created_at: string;
};

export default function GalleryAdmin() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [imageMode, setImageMode] = useState<ImageInputMode>("upload");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, image_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setImages((data ?? []) as GalleryImage[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditImageUrl("");
    setEditFile(null);
    setSelectedFiles([]);
    setImageMode("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    setMessage(null);
  };

  const openEditForm = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditImageUrl(image.image_url);
    setEditFile(null);
    setSelectedFiles([]);
    setImageMode("url");
    setShowForm(true);
    setMessage(null);
  };

  const handleAddImages = async (event: FormEvent) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setMessage({ type: "error", text: "Please choose at least one image." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      for (const file of selectedFiles) {
        const imagePath = await uploadSiteMedia("gallery", file);
        const { error } = await supabase.from("gallery_images").insert({
          image_url: imagePath,
          status: "published",
          published_at: now,
          sort_order: 0,
        });

        if (error) {
          throw error;
        }
      }

      setMessage({
        type: "success",
        text:
          selectedFiles.length === 1
            ? "Image uploaded."
            : `${selectedFiles.length} images uploaded.`,
      });
      await revalidateGalleryContent();
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload images.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateImage = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) return;

    setSaving(true);
    setMessage(null);

    try {
      let imagePath = editImageUrl.trim();

      if (imageMode === "upload") {
        if (editFile) {
          imagePath = await uploadSiteMedia("gallery", editFile);
        } else if (!imagePath) {
          throw new Error("Please choose a new image or keep the current one.");
        }
      } else if (!imagePath) {
        throw new Error("Please enter an image URL or path.");
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("gallery_images")
        .update({ image_url: imagePath })
        .eq("id", editingId);

      if (error) {
        throw error;
      }

      setMessage({ type: "success", text: "Image updated." });
      await revalidateGalleryContent();
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update image.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    await revalidateGalleryContent();

    setMessage({ type: "success", text: "Image deleted." });
    if (editingId === id) {
      resetForm();
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Upload photos for the public gallery page. Images are published automatically."
        action={
          !showForm ? (
            <button type="button" onClick={openAddForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Images
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showForm ? (
        <div className="mb-6">
          <AdminCard title={editingId ? "Replace Image" : "Upload Images"}>
            {editingId ? (
              <form onSubmit={handleUpdateImage} className="space-y-4">
                <ImageInput
                  mode={imageMode}
                  onModeChange={setImageMode}
                  urlValue={editImageUrl}
                  onUrlChange={setEditImageUrl}
                  file={editFile}
                  onFileChange={setEditFile}
                  existingPath={editImageUrl}
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className={btnPrimaryClass}>
                    {saving ? "Saving..." : "Update Image"}
                  </button>
                  <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddImages} className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    setSelectedFiles(Array.from(event.target.files ?? []));
                  }}
                />

                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                  <p className="text-sm text-gray-600">
                    Choose one or more photos from your computer
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`${btnSecondaryClass} mt-4`}
                  >
                    Choose images
                  </button>
                  {selectedFiles.length > 0 ? (
                    <p className="mt-3 text-sm font-medium text-green-700">
                      {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
                    </p>
                  ) : null}
                </div>

                {selectedFiles.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {selectedFiles.map((file) => (
                      <div
                        key={`${file.name}-${file.lastModified}`}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="aspect-square w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving || selectedFiles.length === 0}
                    className={btnPrimaryClass}
                  >
                    {saving ? "Uploading..." : "Upload to Gallery"}
                  </button>
                  <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </AdminCard>
        </div>
      ) : null}

      <AdminCard title={`Gallery Images (${images.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No gallery images yet.</p>
            <button type="button" onClick={openAddForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Upload your first images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
              >
                <img
                  src={getMediaUrl(image.image_url)}
                  alt="Gallery"
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    type="button"
                    aria-label="Edit image"
                    title="Replace image"
                    className={btnIconClass}
                    onClick={() => openEditForm(image)}
                  >
                    <FaPen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete image"
                    title="Delete image"
                    className={btnIconDangerClass}
                    onClick={() => handleDelete(image.id)}
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
