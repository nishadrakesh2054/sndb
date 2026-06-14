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
  phone: string | null;
  email: string | null;
  photo: string | null;
  working_place: string | null;
  degree: string | null;
  specialist: string | null;
  address: string | null;
  sort_order: number;
};

const emptyCategoryForm = {
  id: "",
  label: "",
  heading: "",
  slug: "",
  committee_group: "current" as Category["committee_group"],
  layout: "profile" as Category["layout"],
  sort_order: "0",
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
  specialist: "",
  address: "",
  sort_order: "0",
};

export default function CommitteeAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingMember, setEditingMember] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    const supabase = createClient();
    const [{ data: categoriesData, error: categoriesError }, { data: membersData, error: membersError }] = await Promise.all([
      supabase.from("committee_categories").select("id,label,heading,slug,committee_group,layout,sort_order").order("sort_order", { ascending: true }),
      supabase.from("committee_members").select("*").order("sort_order", { ascending: true }),
    ]);
    if (categoriesError || membersError) setMessage({ type: "error", text: categoriesError?.message ?? membersError?.message ?? "Load failed" });
    else {
      setCategories((categoriesData ?? []) as Category[]);
      setMembers((membersData ?? []) as Member[]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetCategory = () => { setCategoryForm(emptyCategoryForm); setEditingCategory(false); };
  const resetMember = () => { setMemberForm(emptyMemberForm); setEditingMember(false); };

  const saveCategory = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = createClient();
    const payload = {
      label: categoryForm.label.trim(),
      heading: categoryForm.heading.trim(),
      slug: categoryForm.slug.trim() || slugify(categoryForm.heading),
      committee_group: categoryForm.committee_group,
      layout: categoryForm.layout,
      sort_order: Number(categoryForm.sort_order || 0),
    };
    const { error } = editingCategory
      ? await supabase.from("committee_categories").update(payload).eq("id", categoryForm.id)
      : await supabase.from("committee_categories").insert(payload);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: editingCategory ? "Category updated." : "Category created." });
      resetCategory();
      load();
    }
  };

  const saveMember = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = createClient();
    const payload = {
      category_id: memberForm.category_id,
      role_title: memberForm.role_title.trim(),
      name: memberForm.name.trim(),
      phone: memberForm.phone.trim() || null,
      email: memberForm.email.trim() || null,
      photo: memberForm.photo.trim() || null,
      working_place: memberForm.working_place.trim() || null,
      degree: memberForm.degree.trim() || null,
      specialist: memberForm.specialist.trim() || null,
      address: memberForm.address.trim() || null,
      sort_order: Number(memberForm.sort_order || 0),
    };
    const { error } = editingMember
      ? await supabase.from("committee_members").update(payload).eq("id", memberForm.id)
      : await supabase.from("committee_members").insert(payload);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: editingMember ? "Member updated." : "Member created." });
      resetMember();
      load();
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("committee_categories").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Category deleted." });
      load();
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("committee_members").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Member deleted." });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Executive Committee" description="Manage committee categories and members." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <AdminCard title={editingCategory ? "Edit Category" : "Committee Categories"}>
        <form onSubmit={saveCategory} className="grid gap-4 md:grid-cols-2">
          <div><label className={labelClass}>Label</label><input required value={categoryForm.label} onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Heading</label><input required value={categoryForm.heading} onChange={(e) => setCategoryForm({ ...categoryForm, heading: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Slug</label><input value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Group</label><select value={categoryForm.committee_group} onChange={(e) => setCategoryForm({ ...categoryForm, committee_group: e.target.value as Category["committee_group"] })} className={inputClass}><option value="current">Current</option><option value="past">Past</option></select></div>
          <div><label className={labelClass}>Layout</label><select value={categoryForm.layout} onChange={(e) => setCategoryForm({ ...categoryForm, layout: e.target.value as Category["layout"] })} className={inputClass}><option value="profile">Profile</option><option value="simple">Simple</option></select></div>
          <div><label className={labelClass}>Sort order</label><input type="number" value={categoryForm.sort_order} onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })} className={inputClass} /></div>
          <div className="md:col-span-2 flex gap-2">
            <button className={btnPrimaryClass} type="submit">{editingCategory ? "Update Category" : "Create Category"}</button>
            {editingCategory ? <button type="button" className={btnSecondaryClass} onClick={resetCategory}>Cancel</button> : null}
          </div>
        </form>
        {categories.length > 0 ? (
          <div className="mt-5">
            <AdminTable headers={["Heading", "Group", "Layout", "Actions"]}>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-3 py-3"><p className="font-medium">{category.heading}</p><p className="text-xs text-gray-500">{category.slug}</p></td>
                  <td className="px-3 py-3">{category.committee_group}</td>
                  <td className="px-3 py-3">{category.layout}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setCategoryForm({
                          id: category.id,
                          label: category.label,
                          heading: category.heading,
                          slug: category.slug,
                          committee_group: category.committee_group,
                          layout: category.layout,
                          sort_order: String(category.sort_order ?? 0),
                        });
                        setEditingCategory(true);
                      }}>Edit</button>
                      <button type="button" className={btnDangerClass} onClick={() => deleteCategory(category.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        ) : null}
      </AdminCard>

      <AdminCard title={editingMember ? "Edit Member" : "Committee Members"}>
        <form onSubmit={saveMember} className="grid gap-4 md:grid-cols-2">
          <div><label className={labelClass}>Category</label><select required value={memberForm.category_id} onChange={(e) => setMemberForm({ ...memberForm, category_id: e.target.value })} className={inputClass}><option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.heading}</option>)}</select></div>
          <div><label className={labelClass}>Role title</label><input required value={memberForm.role_title} onChange={(e) => setMemberForm({ ...memberForm, role_title: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Name</label><input required value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Phone</label><input value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Email</label><input value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Photo</label><input value={memberForm.photo} onChange={(e) => setMemberForm({ ...memberForm, photo: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Working place</label><input value={memberForm.working_place} onChange={(e) => setMemberForm({ ...memberForm, working_place: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Degree</label><input value={memberForm.degree} onChange={(e) => setMemberForm({ ...memberForm, degree: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Specialist</label><input value={memberForm.specialist} onChange={(e) => setMemberForm({ ...memberForm, specialist: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Address</label><input value={memberForm.address} onChange={(e) => setMemberForm({ ...memberForm, address: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Sort order</label><input type="number" value={memberForm.sort_order} onChange={(e) => setMemberForm({ ...memberForm, sort_order: e.target.value })} className={inputClass} /></div>
          <div className="md:col-span-2 flex gap-2">
            <button className={btnPrimaryClass} type="submit">{editingMember ? "Update Member" : "Create Member"}</button>
            {editingMember ? <button type="button" className={btnSecondaryClass} onClick={resetMember}>Cancel</button> : null}
          </div>
        </form>
        {members.length > 0 ? (
          <div className="mt-5">
            <AdminTable headers={["Name", "Role", "Category", "Actions"]}>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-3 py-3 font-medium">{member.name}</td>
                  <td className="px-3 py-3">{member.role_title}</td>
                  <td className="px-3 py-3">{categories.find((c) => c.id === member.category_id)?.heading ?? "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className={btnSecondaryClass} onClick={() => {
                        setMemberForm({
                          id: member.id,
                          category_id: member.category_id,
                          role_title: member.role_title,
                          name: member.name,
                          phone: member.phone ?? "",
                          email: member.email ?? "",
                          photo: member.photo ?? "",
                          working_place: member.working_place ?? "",
                          degree: member.degree ?? "",
                          specialist: member.specialist ?? "",
                          address: member.address ?? "",
                          sort_order: String(member.sort_order ?? 0),
                        });
                        setEditingMember(true);
                      }}>Edit</button>
                      <button type="button" className={btnDangerClass} onClick={() => deleteMember(member.id)}>Delete</button>
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
