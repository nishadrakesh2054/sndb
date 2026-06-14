"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaExternalLinkAlt, FaFilePdf, FaPen, FaPlus, FaTrash } from "react-icons/fa";
import FileInput, { type FileInputMode } from "@/components/admin/FileInput";
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
import { uploadSiteDocument } from "@/utils/supabase/mediaUpload";
import { createClient } from "@/utils/supabase/client";

type DocumentRow = {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
  updated_at: string;
};

const emptyForm = { id: "", title: "", file_path: "" };

export default function DocumentsAdmin() {
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fileMode, setFileMode] = useState<FileInputMode>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as DocumentRow[]);
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
    setFileMode("upload");
    setSelectedFile(null);
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditing(false);
    setFileMode("upload");
    setSelectedFile(null);
    setShowForm(true);
    setMessage(null);
  };

  const openEditForm = (row: DocumentRow) => {
    setForm({ id: row.id, title: row.title, file_path: row.file_path });
    setEditing(true);
    setFileMode("url");
    setSelectedFile(null);
    setShowForm(true);
    setMessage(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let filePath = form.file_path.trim();

      if (fileMode === "upload") {
        if (selectedFile) {
          filePath = await uploadSiteDocument("documents", selectedFile);
        } else if (!editing || !filePath) {
          throw new Error("Please choose a PDF file to upload.");
        }
      } else if (!filePath) {
        throw new Error("Please enter a file URL or path.");
      }

      const supabase = createClient();
      const now = new Date().toISOString();
      const payload = {
        id: form.id || crypto.randomUUID().replace(/-/g, "").slice(0, 24),
        title: form.title.trim(),
        file_path: filePath,
        updated_at: now,
      };

      const { error } = editing
        ? await supabase.from("documents").update(payload).eq("id", form.id)
        : await supabase.from("documents").insert({ ...payload, created_at: now });

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        text: editing ? "Document updated." : "Document added.",
      });
      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save document.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Document deleted." });
    if (form.id === id) {
      resetForm();
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Documents"
        description="Manage downloadable PDF documents shown on the notice page."
        action={
          !showForm ? (
            <button type="button" onClick={openAddForm} className={btnPrimaryClass}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add Document
            </button>
          ) : null
        }
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      {showForm ? (
        <div className="mb-6">
          <AdminCard title={editing ? "Edit Document" : "Add Document"}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Document title"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>PDF File</label>
                <FileInput
                  mode={fileMode}
                  onModeChange={setFileMode}
                  urlValue={form.file_path}
                  onUrlChange={(value) => setForm({ ...form, file_path: value })}
                  file={selectedFile}
                  onFileChange={setSelectedFile}
                  existingPath={editing ? form.file_path : ""}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={saving} className={btnPrimaryClass}>
                  {saving ? "Saving..." : editing ? "Update Document" : "Add Document"}
                </button>
                <button type="button" onClick={resetForm} className={btnSecondaryClass}>
                  Cancel
                </button>
              </div>
            </form>
          </AdminCard>
        </div>
      ) : null}

      <AdminCard title={`All Documents (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No documents yet.</p>
            <button type="button" onClick={openAddForm} className={`${btnPrimaryClass} mt-4`}>
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Add your first document
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600">
                  <FaFilePdf className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{row.title}</p>
                  <a
                    href={getMediaUrl(row.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-green-700 hover:underline"
                  >
                    Open file
                    <FaExternalLinkAlt className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${row.title}`}
                    title="Edit document"
                    className={btnIconClass}
                    onClick={() => openEditForm(row)}
                  >
                    <FaPen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${row.title}`}
                    title="Delete document"
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
