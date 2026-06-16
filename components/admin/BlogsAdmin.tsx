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
import { revalidateBlogContent } from "@/lib/admin/revalidateSite";
import { createClient } from "@/utils/supabase/client";

type BlogCategory = { id: string; name: string; slug: string };

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  canonical_url: string | null;
};

const emptyBlogForm = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  featured_image: "",
  category_id: "",
  published: true,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
  canonical_url: "",
};

const emptyCategoryForm = { name: "" };

const formatDate = (value: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusClass = (status: Blog["status"]) => {
  if (status === "published") return "bg-green-100 text-green-800";
  if (status === "archived") return "bg-gray-100 text-gray-600";
  return "bg-amber-100 text-amber-800";
};

function buildExcerpt(excerpt: string, content: string): string {
  const trimmed = excerpt.trim();
  if (trimmed.length >= 40) return trimmed;

  const fromContent = content.replace(/\s+/g, " ").trim().slice(0, 200);
  if (fromContent.length >= 40) return fromContent;

  throw new Error("Content must be at least 40 characters long.");
}

function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

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

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);
  const [imageMode, setImageMode] = useState<ImageInputMode>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: blogData, error: blogError }, { data: categoryData, error: categoryError }] =
      await Promise.all([
        supabase
          .from("blogs")
          .select(
            "id, title, slug, excerpt, content, featured_image, category_id, status, published_at, created_at, meta_title, meta_description, meta_keywords, og_title, og_description, canonical_url"
          )
          .order("created_at", { ascending: false }),
        supabase.from("blog_categories").select("id,name,slug").order("name", { ascending: true }),
      ]);

    if (blogError || categoryError) {
      setMessage({
        type: "error",
        text: blogError?.message ?? categoryError?.message ?? "Failed to load blogs.",
      });
    } else {
      setBlogs((blogData ?? []) as Blog[]);
      setCategories((categoryData ?? []) as BlogCategory[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetBlogForm = () => {
    setBlogForm(emptyBlogForm);
    setEditingBlog(false);
    setShowBlogForm(false);
    setImageMode("upload");
    setImageFile(null);
  };

  const openAddBlogForm = () => {
    setBlogForm(emptyBlogForm);
    setEditingBlog(false);
    setImageMode("upload");
    setImageFile(null);
    setShowBlogForm(true);
    setMessage(null);
  };

  const openEditBlogForm = (row: Blog) => {
    setBlogForm({
      id: row.id,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      featured_image: row.featured_image,
      category_id: row.category_id ?? "",
      published: row.status === "published",
      meta_title: row.meta_title ?? "",
      meta_description: row.meta_description ?? "",
      meta_keywords: formatKeywords(row.meta_keywords),
      og_title: row.og_title ?? "",
      og_description: row.og_description ?? "",
      canonical_url: row.canonical_url ?? "",
    });
    setEditingBlog(true);
    setImageMode("url");
    setImageFile(null);
    setShowBlogForm(true);
    setMessage(null);
  };

  const handleBlogSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let imagePath = blogForm.featured_image.trim();

      if (imageMode === "upload") {
        if (imageFile) {
          imagePath = await uploadSiteMedia("blogs", imageFile);
        } else if (!editingBlog || !imagePath) {
          throw new Error("Please choose a featured image to upload.");
        }
      } else if (!imagePath) {
        throw new Error("Please enter an image URL or path.");
      }

      const title = blogForm.title.trim();
      const content = blogForm.content.trim();
      const excerpt = buildExcerpt(blogForm.excerpt, content);
      const existing = editingBlog ? blogs.find((b) => b.id === blogForm.id) : null;
      const slug = existing?.slug ?? slugify(title);
      const now = new Date().toISOString();

      if (!slug) {
        throw new Error("Title must contain letters or numbers.");
      }

      const publishedAt = blogForm.published ? existing?.published_at ?? now : null;
      const readingMinutes = estimateReadingMinutes(content);
      const metaTitle = resolveSeoText(blogForm.meta_title, title);
      const metaDescription = resolveSeoText(blogForm.meta_description, excerpt.slice(0, 160));
      const metaKeywords = parseKeywords(blogForm.meta_keywords);
      const ogTitle = resolveSeoText(blogForm.og_title, metaTitle);
      const ogDescription = resolveSeoText(blogForm.og_description, excerpt.slice(0, 200));
      const canonicalUrl = blogForm.canonical_url.trim() || null;

      if (metaDescription.length > 160) {
        throw new Error("Meta description must be 160 characters or fewer.");
      }

      if (ogDescription.length > 200) {
        throw new Error("Social description must be 200 characters or fewer.");
      }

      const payload = {
        title,
        slug,
        excerpt,
        content,
        featured_image: imagePath,
        featured_image_alt: title,
        category_id: blogForm.category_id || null,
        author_name: "SNDB Editorial Team",
        author_title: null,
        status: blogForm.published ? ("published" as const) : ("draft" as const),
        published_at: publishedAt,
        reading_time_minutes: readingMinutes,
        tags: metaKeywords,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: imagePath,
        canonical_url: canonicalUrl,
      };

      const supabase = createClient();
      const { error } = editingBlog
        ? await supabase.from("blogs").update(payload).eq("id", blogForm.id)
        : await supabase.from("blogs").insert(payload);

      if (error) throw error;

      await revalidateBlogContent(slug);

      setMessage({ type: "success", text: editingBlog ? "Blog updated." : "Blog added." });
      resetBlogForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save blog.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Delete this blog?")) return;

    const deleted = blogs.find((b) => b.id === id);
    const supabase = createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    await revalidateBlogContent(deleted?.slug);

    setMessage({ type: "success", text: "Blog deleted." });
    if (blogForm.id === id) resetBlogForm();
    load();
  };

  const handleCategorySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingCategory(true);
    setMessage(null);

    try {
      const name = categoryForm.name.trim();
      const slug = slugify(name);

      if (!slug) {
        throw new Error("Category name must contain letters or numbers.");
      }

      const supabase = createClient();
      const { error } = await supabase.from("blog_categories").insert({ name, slug });

      if (error) throw error;

      await revalidateBlogContent();

      setCategoryForm(emptyCategoryForm);
      setShowCategoryForm(false);
      setMessage({ type: "success", text: "Category added." });
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to add category.",
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    await revalidateBlogContent();

    setMessage({ type: "success", text: "Category deleted." });
    load();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blogs"
        description="Manage blog articles shown on the blog page and homepage."
        action={
          !showBlogForm ? (
            <button type="button" onClick={openAddBlogForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Blog
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showBlogForm ? (
        <AdminCard title={editingBlog ? "Edit Blog" : "Add Blog"}>
          <form onSubmit={handleBlogSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                required
                value={blogForm.title}
                onChange={(event) => setBlogForm({ ...blogForm, title: event.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Short summary</label>
              <textarea
                value={blogForm.excerpt}
                onChange={(event) => setBlogForm({ ...blogForm, excerpt: event.target.value })}
                rows={2}
                placeholder="Optional — auto-filled from content if left empty"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Content</label>
              <textarea
                required
                value={blogForm.content}
                onChange={(event) => setBlogForm({ ...blogForm, content: event.target.value })}
                rows={6}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Featured Image</label>
              <ImageInput
                mode={imageMode}
                onModeChange={setImageMode}
                urlValue={blogForm.featured_image}
                onUrlChange={(value) => setBlogForm({ ...blogForm, featured_image: value })}
                file={imageFile}
                onFileChange={setImageFile}
                existingPath={editingBlog ? blogForm.featured_image : ""}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                value={blogForm.category_id}
                onChange={(event) =>
                  setBlogForm({ ...blogForm, category_id: event.target.value })
                }
                className={inputClass}
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={blogForm.published}
                onChange={(event) =>
                  setBlogForm({ ...blogForm, published: event.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              Publish on site
            </label>

            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">SEO &amp; search</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to use the article title and summary. These values appear in Google
                  results and social previews.
                </p>
              </div>

              <div>
                <label className={labelClass}>Meta title</label>
                <input
                  value={blogForm.meta_title}
                  onChange={(event) =>
                    setBlogForm({ ...blogForm, meta_title: event.target.value })
                  }
                  placeholder={blogForm.title || "Uses article title if empty"}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Meta description
                  <span className="ml-2 font-normal text-gray-400">
                    ({blogForm.meta_description.length || blogForm.excerpt.length}/160)
                  </span>
                </label>
                <textarea
                  value={blogForm.meta_description}
                  onChange={(event) =>
                    setBlogForm({ ...blogForm, meta_description: event.target.value })
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
                  value={blogForm.meta_keywords}
                  onChange={(event) =>
                    setBlogForm({ ...blogForm, meta_keywords: event.target.value })
                  }
                  placeholder="SNDB, healthcare, Nepal doctors (comma-separated)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Social share title</label>
                <input
                  value={blogForm.og_title}
                  onChange={(event) =>
                    setBlogForm({ ...blogForm, og_title: event.target.value })
                  }
                  placeholder="Uses meta title if empty"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Social share description
                  <span className="ml-2 font-normal text-gray-400">
                    ({blogForm.og_description.length}/200)
                  </span>
                </label>
                <textarea
                  value={blogForm.og_description}
                  onChange={(event) =>
                    setBlogForm({ ...blogForm, og_description: event.target.value })
                  }
                  rows={2}
                  maxLength={200}
                  placeholder="Uses summary if empty"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Canonical URL (optional)</label>
                <input
                  value={blogForm.canonical_url}
                  onChange={(event) =>
                    setBlogForm({ ...blogForm, canonical_url: event.target.value })
                  }
                  placeholder="https://example.com/blog/my-article"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>
                {saving ? "Saving..." : editingBlog ? "Update Blog" : "Add Blog"}
              </button>
              <button type="button" onClick={resetBlogForm} className={btnSecondaryClass}>
                Cancel
              </button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      <AdminCard title={`All Blogs (${blogs.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : blogs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No blogs yet.</p>
            <button type="button" onClick={openAddBlogForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add your first blog
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
                    Category
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
                {blogs.map((row) => (
                  <tr key={row.id} className="transition hover:bg-gray-50/80">
                    <td className="px-4 py-4 align-top">
                      <div className="h-14 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <img
                          src={getMediaUrl(row.featured_image)}
                          alt={row.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-4 align-top">
                      <p className="font-semibold text-gray-900">{row.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{row.excerpt}</p>
                    </td>
                    <td className="px-4 py-4 align-top text-gray-700">
                      {row.category_id ? categoryMap[row.category_id]?.name ?? "—" : "—"}
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
                          title="Edit blog"
                          className={btnIconClass}
                          onClick={() => openEditBlogForm(row)}
                        >
                          <FaPen className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${row.title}`}
                          title="Delete blog"
                          className={btnIconDangerClass}
                          onClick={() => handleDeleteBlog(row.id)}
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

      <AdminCard title={`Categories (${categories.length})`}>
        <div className="mb-4 flex justify-end">
          {!showCategoryForm ? (
            <button
              type="button"
              onClick={() => setShowCategoryForm(true)}
              className={btnSecondaryClass}
            >
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Category
            </button>
          ) : null}
        </div>

        {showCategoryForm ? (
          <form
            onSubmit={handleCategorySubmit}
            className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row"
          >
            <input
              required
              value={categoryForm.name}
              onChange={(event) => setCategoryForm({ name: event.target.value })}
              placeholder="Category name"
              className={inputClass}
            />
            <div className="flex gap-2">
              <button type="submit" disabled={savingCategory} className={btnPrimaryClass}>
                {savingCategory ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryForm(false);
                  setCategoryForm(emptyCategoryForm);
                }}
                className={btnSecondaryClass}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {categories.map((category) => (
                  <tr key={category.id} className="transition hover:bg-gray-50/80">
                    <td className="px-4 py-4 align-top font-semibold text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          aria-label={`Delete ${category.name}`}
                          title="Delete category"
                          className={btnIconDangerClass}
                          onClick={() => handleCategoryDelete(category.id)}
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
