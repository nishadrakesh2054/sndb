"use client";

import { useEffect, useState } from "react";
import {
  AdminAlert,
  AdminCard,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/AdminUi";
import { btnDangerClass } from "@/lib/admin/config";
import { createClient } from "@/utils/supabase/client";

type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
};

export default function ContactAdmin() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) setMessage({ type: "error", text: error.message });
    else setRows((data ?? []) as ContactMessage[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Message deleted." });
      load();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Contact Messages" description="Read-only list; delete is allowed." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}
      <AdminCard title="Inbox">
        {loading ? <p className="text-sm text-gray-500">Loading...</p> : rows.length === 0 ? <p className="text-sm text-gray-500">No messages yet.</p> : (
          <AdminTable headers={["Name", "Contact", "Message", "Date", "Actions"]}>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-3 font-medium">{row.name}</td>
                <td className="px-3 py-3 text-gray-700">
                  <p>{row.phone}</p>
                  <p className="text-xs">{row.email}</p>
                </td>
                <td className="px-3 py-3 text-gray-700">{row.message}</td>
                <td className="px-3 py-3 text-gray-700">{new Date(row.created_at).toLocaleString()}</td>
                <td className="px-3 py-3">
                  <button type="button" className={btnDangerClass} onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
