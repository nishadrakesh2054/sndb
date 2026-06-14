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
import { createClient } from "@/utils/supabase/client";

type Category = {
  id: string;
  label: string;
  heading: string;
  slug: string;
  committee_group: "current" | "past";
  layout: "profile" | "simple";
  sort_order: number;
};

type Member = {
  id: string;
  category_id: string;
  role_title: string;
  name: string;
  phone: number | null;
  email: string | null;
  photo: string | null;
  working_place: string | null;
  degree: string | null;
  sort_order: number;
};

const emptyCategoryForm = {
  id: "",
  label: "",
  heading: "",
  committee_group: "current" as Category["committee_group"],
  layout: "profile" as Category["layout"],
};

const emptyMemberForm = {
  id: "",
  category_id: "",
  role_title: "",
  name: "",
  phone: "",
  email: "",
  photo: "",
  working_place: "",
  degree: "",
};

const groupClass = (group: Category["committee_group"]) =>
  group === "current" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";

export default function CommitteeAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingMember, setEditingMember] = useState(false);
  const [imageMode, setImageMode] = useState<ImageInputMode>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: categoriesData, error: categoriesError }, { data: membersData, error: membersError }] =
      await Promise.all([
        supabase
          .from("committee_categories")
          .select("id,label,heading,slug,committee_group,layout,sort_order")
          .order("sort_order", { ascending: true }),
        supabase.from("committee_members").select("*").order("sort_order", { ascending: true }),
      ]);

    if (categoriesError || membersError) {
      setMessage({
        type: "error",
        text: categoriesError?.message ?? membersError?.message ?? "Failed to load committee data.",
      });
    } else {
      setCategories((categoriesData ?? []) as Category[]);
      setMembers((membersData ?? []) as Member[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategoryForm);
    setEditingCategory(false);
    setShowCategoryForm(false);
  };

  const resetMemberForm = () => {
    setMemberForm(emptyMemberForm);
    setEditingMember(false);
    setShowMemberForm(false);
    setImageMode("upload");
    setImageFile(null);
  };

  const openAddCategoryForm = () => {
    setCategoryForm(emptyCategoryForm);
    setEditingCategory(false);
    setShowCategoryForm(true);
    setMessage(null);
  };

  const openEditCategoryForm = (category: Category) => {
    setCategoryForm({
      id: category.id,
      label: category.label,
      heading: category.heading,
      committee_group: category.committee_group,
      layout: category.layout,
    });
    setEditingCategory(true);
    setShowCategoryForm(true);
    setMessage(null);
  };

  const openAddMemberForm = () => {
    setMemberForm({
      ...emptyMemberForm,
      category_id: categories[0]?.id ?? "",
    });
    setEditingMember(false);
    setImageMode("upload");
    setImageFile(null);
    setShowMemberForm(true);
    setMessage(null);
  };

  const openEditMemberForm = (member: Member) => {
    setMemberForm({
      id: member.id,
      category_id: member.category_id,
      role_title: member.role_title,
      name: member.name,
      phone: member.phone != null ? String(member.phone) : "",
      email: member.email ?? "",
      photo: member.photo ?? "",
      working_place: member.working_place ?? "",
      degree: member.degree ?? "",
    });
    setEditingMember(true);
    setImageMode("url");
    setImageFile(null);
    setShowMemberForm(true);
    setMessage(null);
  };

  const saveCategory = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const heading = categoryForm.heading.trim();
      const label = categoryForm.label.trim() || heading;
      const existing = editingCategory
        ? categories.find((c) => c.id === categoryForm.id)
        : null;
      const slug = existing?.slug ?? slugify(heading);

      if (!slug) {
        throw new Error("Section heading must contain letters or numbers.");
      }

      const supabase = createClient();
      const payload = {
        label,
        heading,
        slug,
        committee_group: categoryForm.committee_group,
        layout: categoryForm.layout,
        sort_order: existing?.sort_order ?? categories.length + 1,
      };

      const { error } = editingCategory
        ? await supabase.from("committee_categories").update(payload).eq("id", categoryForm.id)
        : await supabase.from("committee_categories").insert(payload);

      if (error) throw error;

      setMessage({
        type: "success",
        text: editingCategory ? "Section updated." : "Section added.",
      });
      resetCategoryForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save section.",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveMember = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let photoPath = memberForm.photo.trim();

      if (imageMode === "upload") {
        if (imageFile) {
          photoPath = await uploadSiteMedia("committee", imageFile);
        }
      }

      const phoneValue = memberForm.phone.trim();
      const phone = phoneValue ? Number(phoneValue) : null;

      if (phoneValue && Number.isNaN(phone)) {
        throw new Error("Phone must be a valid number.");
      }

      const supabase = createClient();
      const payload = {
        category_id: memberForm.category_id,
        role_title: memberForm.role_title.trim(),
        name: memberForm.name.trim(),
        phone,
        email: memberForm.email.trim() || null,
        photo: photoPath || null,
        working_place: memberForm.working_place.trim() || null,
        degree: memberForm.degree.trim() || null,
        specialist: null,
        address: null,
        sort_order: editingMember
          ? members.find((m) => m.id === memberForm.id)?.sort_order ?? 0
          : members.filter((m) => m.category_id === memberForm.category_id).length + 1,
      };

      const { error } = editingMember
        ? await supabase.from("committee_members").update(payload).eq("id", memberForm.id)
        : await supabase.from("committee_members").insert(payload);

      if (error) throw error;

      setMessage({
        type: "success",
        text: editingMember ? "Member updated." : "Member added.",
      });
      resetMemberForm();
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

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this section and all its members?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("committee_categories").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Section deleted." });
    if (categoryForm.id === id) resetCategoryForm();
    load();
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this committee member?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("committee_members").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Member deleted." });
    if (memberForm.id === id) resetMemberForm();
    load();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Executive Committee"
        description="Manage committee sections and members for current and past executive pages."
        action={
          !showMemberForm ? (
            <button
              type="button"
              onClick={openAddMemberForm}
              className={btnPrimaryClass}
              disabled={categories.length === 0}
            >
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Member
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showMemberForm ? (
        <AdminCard title={editingMember ? "Edit Member" : "Add Member"}>
          <form onSubmit={saveMember} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Section</label>
                <select
                  required
                  value={memberForm.category_id}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, category_id: event.target.value })
                  }
                  className={inputClass}
                >
                  <option value="">Select section</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.heading} ({category.committee_group})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <input
                  required
                  value={memberForm.role_title}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, role_title: event.target.value })
                  }
                  placeholder="President"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Name</label>
              <input
                required
                value={memberForm.name}
                onChange={(event) => setMemberForm({ ...memberForm, name: event.target.value })}
                placeholder="Dr. John Doe"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  value={memberForm.phone}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, phone: event.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, email: event.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Working Place</label>
                <input
                  value={memberForm.working_place}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, working_place: event.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Degree</label>
                <input
                  value={memberForm.degree}
                  onChange={(event) =>
                    setMemberForm({ ...memberForm, degree: event.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Photo</label>
              <ImageInput
                mode={imageMode}
                onModeChange={setImageMode}
                urlValue={memberForm.photo}
                onUrlChange={(value) => setMemberForm({ ...memberForm, photo: value })}
                file={imageFile}
                onFileChange={setImageFile}
                existingPath={editingMember ? memberForm.photo : ""}
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>
                {saving ? "Saving..." : editingMember ? "Update Member" : "Add Member"}
              </button>
              <button type="button" onClick={resetMemberForm} className={btnSecondaryClass}>
                Cancel
              </button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      <AdminCard
        title={`Members (${members.length})`}
      >
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : members.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No committee members yet.</p>
            {categories.length > 0 ? (
              <button type="button" onClick={openAddMemberForm} className={`${btnPrimaryClass} mt-4`}>
                <FaPlus className="mr-2 h-3.5 w-3.5" />
                Add your first member
              </button>
            ) : (
              <p className="mt-2 text-xs text-gray-500">Add a section first.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Section
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Working Place
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Degree
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {members.map((member) => {
                  const category = categoryMap[member.category_id];

                  return (
                    <tr key={member.id} className="transition hover:bg-gray-50/80">
                      <td className="px-4 py-4 align-top">
                        <div className="h-11 w-11 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                          {member.photo ? (
                            <img
                              src={getMediaUrl(member.photo)}
                              alt={member.name}
                              className="h-full w-full object-cover object-top"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              —
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 align-top font-semibold text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-4 py-4 align-top text-gray-700">{member.role_title}</td>
                      <td className="px-4 py-4 align-top text-gray-700">
                        {category?.heading ?? "—"}
                      </td>
                      <td className="px-4 py-4 align-top">
                        {category ? (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${groupClass(category.committee_group)}`}
                          >
                            {category.committee_group}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 align-top text-gray-700">
                        {member.phone ?? "—"}
                      </td>
                      <td className="max-w-[160px] px-4 py-4 align-top">
                        {member.email ? (
                          <a
                            href={`mailto:${member.email}`}
                            className="break-all text-gray-700 hover:text-green-700"
                          >
                            {member.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="max-w-[140px] px-4 py-4 align-top text-gray-700">
                        {member.working_place ?? "—"}
                      </td>
                      <td className="px-4 py-4 align-top text-gray-700">{member.degree ?? "—"}</td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            aria-label={`Edit ${member.name}`}
                            title="Edit member"
                            className={btnIconClass}
                            onClick={() => openEditMemberForm(member)}
                          >
                            <FaPen className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${member.name}`}
                            title="Delete member"
                            className={btnIconDangerClass}
                            onClick={() => deleteMember(member.id)}
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

      <AdminCard
        title={`Sections (${categories.length})`}
      >
        <div className="mb-4 flex justify-end">
          {!showCategoryForm ? (
            <button type="button" onClick={openAddCategoryForm} className={btnSecondaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Section
            </button>
          ) : null}
        </div>

        {showCategoryForm ? (
          <form onSubmit={saveCategory} className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Section Heading</label>
                <input
                  required
                  value={categoryForm.heading}
                  onChange={(event) =>
                    setCategoryForm({ ...categoryForm, heading: event.target.value })
                  }
                  placeholder="Office Bearers"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Label</label>
                <input
                  value={categoryForm.label}
                  onChange={(event) =>
                    setCategoryForm({ ...categoryForm, label: event.target.value })
                  }
                  placeholder="Leadership"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Group</label>
                <select
                  value={categoryForm.committee_group}
                  onChange={(event) =>
                    setCategoryForm({
                      ...categoryForm,
                      committee_group: event.target.value as Category["committee_group"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="current">Current</option>
                  <option value="past">Past</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Layout</label>
                <select
                  value={categoryForm.layout}
                  onChange={(event) =>
                    setCategoryForm({
                      ...categoryForm,
                      layout: event.target.value as Category["layout"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="profile">Profile cards</option>
                  <option value="simple">Simple list</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className={btnPrimaryClass}>
                {saving ? "Saving..." : editingCategory ? "Update Section" : "Add Section"}
              </button>
              <button type="button" onClick={resetCategoryForm} className={btnSecondaryClass}>
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">No sections yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Heading
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Label
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Group
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Layout
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
                      {category.heading}
                    </td>
                    <td className="px-4 py-4 align-top text-gray-700">{category.label}</td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${groupClass(category.committee_group)}`}
                      >
                        {category.committee_group}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top capitalize text-gray-700">
                      {category.layout}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${category.heading}`}
                          title="Edit section"
                          className={btnIconClass}
                          onClick={() => openEditCategoryForm(category)}
                        >
                          <FaPen className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${category.heading}`}
                          title="Delete section"
                          className={btnIconDangerClass}
                          onClick={() => deleteCategory(category.id)}
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
