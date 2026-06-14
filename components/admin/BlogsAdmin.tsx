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

type BlogCategory = { id: string; name: string; slug: string };
type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_alt: string | null;
  category_id: string | null;
  author_name: string;
  author_title: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  reading_time_minutes: number | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
};

const emptyBlogForm = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  featured_image_alt: "",
  category_id: "",
  author_name: "",
  author_title: "",
  status: "draft" as Blog["status"],
  published_at: "",
  reading_time_minutes: "",
  tags: "",
  meta_title: "",
  meta_description: "",
};

const emptyCategoryForm = { name: "", slug: "" };

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [editingBlog, setEditingBlog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingBlog, setSavingBlog] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: blogData, error: blogError }, { data: categoryData, error: categoryError }] = await Promise.all([
      supabase.from("blogs").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_categories").select("id,name,slug").order("name", { ascending: true }),
    ]);
    if (blogError || categoryError) {
      setMessage({ type: "error", text: blogError?.message ?? categoryError?.message ?? "Failed to load data." });
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
  };

  const handleBlogSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingBlog(true);
    setMessage(null);
    const supabase = createClient();
    const payload = {
      title: blogForm.title.trim(),
      slug: blogForm.slug.trim() || slugify(blogForm.title),
      excerpt: blogForm.excerpt.trim(),
      content: blogForm.content.trim(),
      featured_image: blogForm.featured_image.trim(),
      featured_image_alt: blogForm.featured_image_alt.trim() || null,
      category_id: blogForm.category_id || null,
      author_name: blogForm.author_name.trim() || "SNDB Editorial Team",
      author_title: blogForm.author_title.trim() || null,
      status: blogForm.status,
      published_at: blogForm.published_at ? new Date(blogForm.published_at).toISOString() : null,
      reading_time_minutes: blogForm.reading_time_minutes ? Number(blogForm.reading_time_minutes) : null,
      tags: blogForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      meta_title: blogForm.meta_title.trim() || null,
      meta_description: blogForm.meta_description.trim() || null,
    };
    const { error } = editingBlog
      ? await supabase.from("blogs").update(payload).eq("id", blogForm.id)
      : await supabase.from("blogs").insert(payload);
    setSavingBlog(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: editingBlog ? "Blog updated." : "Blog created." });
    resetBlogForm();
    load();
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Blog deleted." });
      load();
    }
  };

  const handleCategorySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingCategory(true);
    const supabase = createClient();
    const { error } = await supabase.from("blog_categories").insert({
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim() || slugify(categoryForm.name),
    });
    setSavingCategory(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setCategoryForm(emptyCategoryForm);
    setMessage({ type: "success", text: "Category added." });
    load();
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Category deleted." });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Blogs" description="Manage blog posts and blog categories." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <AdminCard title="Blog Post">
        <form onSubmit={handleBlogSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input required value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Featured image</label>
            <input required value={blogForm.featured_image} onChange={(e) => setBlogForm({ ...blogForm, featured_image: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Featured image alt</label>
            <input value={blogForm.featured_image_alt} onChange={(e) => setBlogForm({ ...blogForm, featured_image_alt: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Excerpt</label>
            <textarea required value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} className={inputClass} rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Content</label>
            <textarea required value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} className={inputClass} rows={5} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select value={blogForm.category_id} onChange={(e) => setBlogForm({ ...blogForm, category_id: e.target.value })} className={inputClass}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={blogForm.status} onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as Blog["status"] })} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Author name</label>
            <input value={blogForm.author_name} onChange={(e) => setBlogForm({ ...blogForm, author_name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Author title</label>
            <input value={blogForm.author_title} onChange={(e) => setBlogForm({ ...blogForm, author_title: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Published at</label>
            <input type="datetime-local" value={blogForm.published_at} onChange={(e) => setBlogForm({ ...blogForm, published_at: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Reading time (minutes)</label>
            <input type="number" min={1} value={blogForm.reading_time_minutes} onChange={(e) => setBlogForm({ ...blogForm, reading_time_minutes: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Tags (comma separated)</label>
            <input value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Meta title</label>
            <input value={blogForm.meta_title} onChange={(e) => setBlogForm({ ...blogForm, meta_title: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Meta description</label>
            <textarea value={blogForm.meta_description} onChange={(e) => setBlogForm({ ...blogForm, meta_description: e.target.value })} className={inputClass} rows={2} />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" disabled={savingBlog} className={btnPrimaryClass}>{savingBlog ? "Saving..." : editingBlog ? "Update" : "Create"}</button>
            {editingBlog ? <button type="button" className={btnSecondaryClass} onClick={resetBlogForm}>Cancel</button> : null}
          </div>
        </form>
      </AdminCard>

      <AdminCard title="All Blogs">
        {loading ? <p className="text-sm text-gray-500">Loading...</p> : blogs.length === 0 ? <p className="text-sm text-gray-500">No blogs yet.</p> : (
          <AdminTable headers={["Title", "Status", "Category", "Actions"]}>
            {blogs.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-3">
                  <p className="font-medium text-gray-900">{row.title}</p>
                  <p className="text-xs text-gray-500">{row.slug}</p>
                </td>
                <td className="px-3 py-3">{row.status}</td>
                <td className="px-3 py-3">{categories.find((c) => c.id === row.category_id)?.name ?? "-"}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button type="button" className={btnSecondaryClass} onClick={() => {
                      setBlogForm({
                        id: row.id,
                        title: row.title,
                        slug: row.slug,
                        excerpt: row.excerpt,
                        content: row.content,
                        featured_image: row.featured_image,
                        featured_image_alt: row.featured_image_alt ?? "",
                        category_id: row.category_id ?? "",
                        author_name: row.author_name,
                        author_title: row.author_title ?? "",
                        status: row.status,
                        published_at: row.published_at ? row.published_at.slice(0, 16) : "",
                        reading_time_minutes: row.reading_time_minutes ? String(row.reading_time_minutes) : "",
                        tags: (row.tags ?? []).join(", "),
                        meta_title: row.meta_title ?? "",
                        meta_description: row.meta_description ?? "",
                      });
                      setEditingBlog(true);
                    }}>Edit</button>
                    <button type="button" className={btnDangerClass} onClick={() => handleDeleteBlog(row.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <AdminCard title="Blog Categories">
        <form onSubmit={handleCategorySubmit} className="mb-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className={inputClass} placeholder="Category name" />
          <input value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} className={inputClass} placeholder="Slug (optional)" />
          <button type="submit" disabled={savingCategory} className={btnPrimaryClass}>{savingCategory ? "Adding..." : "Add Category"}</button>
        </form>
        {categories.length === 0 ? <p className="text-sm text-gray-500">No categories yet.</p> : (
          <AdminTable headers={["Name", "Slug", "Actions"]}>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-3 py-3 font-medium text-gray-900">{category.name}</td>
                <td className="px-3 py-3 text-gray-600">{category.slug}</td>
                <td className="px-3 py-3">
                  <button type="button" className={btnDangerClass} onClick={() => handleCategoryDelete(category.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
