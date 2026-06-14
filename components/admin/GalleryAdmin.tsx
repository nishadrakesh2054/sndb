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

type Status = "draft" | "published" | "archived";
type Album = { id: string; title: string; slug: string; status: Status; sort_order: number; cover_image: string | null };
type ImageRow = {
  id: string;
  album_id: string | null;
  title: string | null;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  status: Status;
  published_at: string | null;
};

const emptyAlbumForm = { id: "", title: "", slug: "", status: "draft" as Status, sort_order: "0", cover_image: "" };
const emptyImageForm = {
  id: "",
  album_id: "",
  title: "",
  image_url: "",
  alt_text: "",
  caption: "",
  sort_order: "0",
  status: "draft" as Status,
  published_at: "",
};

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [albumForm, setAlbumForm] = useState(emptyAlbumForm);
  const [imageForm, setImageForm] = useState(emptyImageForm);
  const [editingAlbum, setEditingAlbum] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: albumData, error: albumError }, { data: imageData, error: imageError }] = await Promise.all([
      supabase.from("gallery_albums").select("id,title,slug,status,sort_order,cover_image").order("sort_order", { ascending: true }),
      supabase.from("gallery_images").select("*").order("created_at", { ascending: false }),
    ]);
    if (albumError || imageError) setMessage({ type: "error", text: albumError?.message ?? imageError?.message ?? "Failed to load gallery data." });
    else {
      setAlbums((albumData ?? []) as Album[]);
      setImages((imageData ?? []) as ImageRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetAlbum = () => { setAlbumForm(emptyAlbumForm); setEditingAlbum(false); };
  const resetImage = () => { setImageForm(emptyImageForm); setEditingImage(false); };

  const saveAlbum = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = createClient();
    const payload = {
      title: albumForm.title.trim(),
      slug: albumForm.slug.trim() || slugify(albumForm.title),
      status: albumForm.status,
      sort_order: Number(albumForm.sort_order || 0),
      cover_image: albumForm.cover_image.trim() || null,
    };
    const { error } = editingAlbum
      ? await supabase.from("gallery_albums").update(payload).eq("id", albumForm.id)
      : await supabase.from("gallery_albums").insert(payload);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: editingAlbum ? "Album updated." : "Album created." });
      resetAlbum();
      load();
    }
  };

  const saveImage = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = createClient();
    const payload = {
      album_id: imageForm.album_id || null,
      title: imageForm.title.trim() || null,
      image_url: imageForm.image_url.trim(),
      alt_text: imageForm.alt_text.trim() || null,
      caption: imageForm.caption.trim() || null,
      sort_order: Number(imageForm.sort_order || 0),
      status: imageForm.status,
      published_at: imageForm.published_at ? new Date(imageForm.published_at).toISOString() : null,
    };
    const { error } = editingImage
      ? await supabase.from("gallery_images").update(payload).eq("id", imageForm.id)
      : await supabase.from("gallery_images").insert(payload);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: editingImage ? "Image updated." : "Image created." });
      resetImage();
      load();
    }
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm("Delete this album? Images in it may also be deleted.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Album deleted." });
      load();
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Image deleted." });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Gallery" description="Manage gallery albums and images." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <AdminCard title={editingAlbum ? "Edit Album" : "Manage Albums"}>
        <form onSubmit={saveAlbum} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input required value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input value={albumForm.slug} onChange={(e) => setAlbumForm({ ...albumForm, slug: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={albumForm.status} onChange={(e) => setAlbumForm({ ...albumForm, status: e.target.value as Status })} className={inputClass}>
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Sort order</label>
            <input type="number" value={albumForm.sort_order} onChange={(e) => setAlbumForm({ ...albumForm, sort_order: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Cover image</label>
            <input value={albumForm.cover_image} onChange={(e) => setAlbumForm({ ...albumForm, cover_image: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button className={btnPrimaryClass} type="submit">{editingAlbum ? "Update Album" : "Create Album"}</button>
            {editingAlbum ? <button type="button" className={btnSecondaryClass} onClick={resetAlbum}>Cancel</button> : null}
          </div>
        </form>

        {!loading && albums.length > 0 ? (
          <div className="mt-5">
            <AdminTable headers={["Title", "Status", "Order", "Actions"]}>
              {albums.map((album) => (
                <tr key={album.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium">{album.title}</p>
                    <p className="text-xs text-gray-500">{album.slug}</p>
                  </td>
                  <td className="px-3 py-3">{album.status}</td>
                  <td className="px-3 py-3">{album.sort_order}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setAlbumForm({
                          id: album.id,
                          title: album.title,
                          slug: album.slug,
                          status: album.status,
                          sort_order: String(album.sort_order ?? 0),
                          cover_image: album.cover_image ?? "",
                        });
                        setEditingAlbum(true);
                      }}>Edit</button>
                      <button type="button" className={btnDangerClass} onClick={() => deleteAlbum(album.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        ) : null}
      </AdminCard>

      <AdminCard title={editingImage ? "Edit Image" : "Manage Images"}>
        <form onSubmit={saveImage} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Album</label>
            <select required value={imageForm.album_id} onChange={(e) => setImageForm({ ...imageForm, album_id: e.target.value })} className={inputClass}>
              <option value="">Select album</option>
              {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input value={imageForm.title} onChange={(e) => setImageForm({ ...imageForm, title: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Image URL</label>
            <input required value={imageForm.image_url} onChange={(e) => setImageForm({ ...imageForm, image_url: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Alt text</label>
            <input value={imageForm.alt_text} onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Caption</label>
            <input value={imageForm.caption} onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sort order</label>
            <input type="number" value={imageForm.sort_order} onChange={(e) => setImageForm({ ...imageForm, sort_order: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={imageForm.status} onChange={(e) => setImageForm({ ...imageForm, status: e.target.value as Status })} className={inputClass}>
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Published at</label>
            <input type="datetime-local" value={imageForm.published_at} onChange={(e) => setImageForm({ ...imageForm, published_at: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button className={btnPrimaryClass} type="submit">{editingImage ? "Update Image" : "Create Image"}</button>
            {editingImage ? <button type="button" className={btnSecondaryClass} onClick={resetImage}>Cancel</button> : null}
          </div>
        </form>

        {!loading && images.length > 0 ? (
          <div className="mt-5">
            <AdminTable headers={["Title", "Album", "Status", "Actions"]}>
              {images.map((image) => (
                <tr key={image.id}>
                  <td className="px-3 py-3 text-gray-700">{image.title || "(Untitled)"}</td>
                  <td className="px-3 py-3 text-gray-700">{albums.find((a) => a.id === image.album_id)?.title ?? "-"}</td>
                  <td className="px-3 py-3">{image.status}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setImageForm({
                          id: image.id,
                          album_id: image.album_id ?? "",
                          title: image.title ?? "",
                          image_url: image.image_url,
                          alt_text: image.alt_text ?? "",
                          caption: image.caption ?? "",
                          sort_order: String(image.sort_order ?? 0),
                          status: image.status,
                          published_at: image.published_at ? image.published_at.slice(0, 16) : "",
                        });
                        setEditingImage(true);
                      }}>Edit</button>
                      <button type="button" className={btnDangerClass} onClick={() => deleteImage(image.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        ) : null}
      </AdminCard>
    </div>
  );
}
