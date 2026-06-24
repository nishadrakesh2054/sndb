"use client";

import { useEffect, useState } from "react";
import { FaEnvelope, FaPen, FaPhone, FaTimes, FaTrash, FaUser } from "react-icons/fa";
import {
  AdminAlert,
  AdminCard,
  AdminPageHeader,
} from "@/components/admin/AdminUi";
import {
  btnIconClass,
  btnIconDangerClass,
  btnDangerClass,
  btnSecondaryClass,
} from "@/lib/admin/config";
import { createClient } from "@/utils/supabase/client";

type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function ContactAdmin() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as ContactMessage[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Message deleted." });
    if (selected?.id === id) {
      setSelected(null);
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Contact Messages"
        description="Messages submitted through the website contact form."
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <AdminCard title={`Inbox (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No messages yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[720px] divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Received
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
                      <p className="font-semibold text-gray-900">{row.name}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1 text-gray-700">
                        <a
                          href={`tel:${row.phone}`}
                          className="flex items-center gap-2 hover:text-green-700"
                        >
                          <FaPhone className="h-3 w-3 shrink-0 text-green-600" />
                          <span>{row.phone}</span>
                        </a>
                        <a
                          href={`mailto:${row.email}`}
                          className="flex items-center gap-2 break-all hover:text-green-700"
                        >
                          <FaEnvelope className="h-3 w-3 shrink-0 text-green-600" />
                          <span>{row.email}</span>
                        </a>
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-4 align-top text-gray-600">
                      <p className="line-clamp-2">{row.message}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 align-top text-gray-500">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`View message from ${row.name}`}
                          title="View message"
                          className={btnIconClass}
                          onClick={() => setSelected(row)}
                        >
                          <FaPen className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete message from ${row.name}`}
                          title="Delete message"
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

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                  Contact Message
                </p>
                <h2 className="mt-1 text-lg font-bold text-gray-900">{selected.name}</h2>
                <p className="mt-1 text-xs text-gray-500">{formatDate(selected.created_at)}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                className={btnIconClass}
                onClick={() => setSelected(null)}
              >
                <FaTimes className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <FaUser className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-900">{selected.name}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-gray-700 hover:border-green-300 hover:bg-green-50"
                >
                  <FaPhone className="h-4 w-4 text-green-600" />
                  {selected.phone}
                </a>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-gray-700 hover:border-green-300 hover:bg-green-50"
                >
                  <FaEnvelope className="h-4 w-4 text-green-600" />
                  <span className="truncate">{selected.email}</span>
                </a>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Message
                </p>
                <p className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                  {selected.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
              <button type="button" className={btnSecondaryClass} onClick={() => setSelected(null)}>
                Close
              </button>
              <button
                type="button"
                className={btnDangerClass}
                onClick={() => handleDelete(selected.id)}
              >
                <FaTrash className="mr-2 h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
