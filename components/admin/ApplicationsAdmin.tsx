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

type MembershipApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  profile_image: string;
  voucher_image: string;
  created_at: string;
};

export default function ApplicationsAdmin() {
  const [rows, setRows] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("membership_applications").select("*").order("created_at", { ascending: false });
    if (error) setMessage({ type: "error", text: error.message });
    else setRows((data ?? []) as MembershipApplication[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("membership_applications").delete().eq("id", id);
    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "success", text: "Application deleted." });
      load();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Membership Applications" description="Read-only list; delete is allowed." />
      {message ? <AdminAlert type={message.type} message={message.text} /> : null}
      <AdminCard title="Applications">
        {loading ? <p className="text-sm text-gray-500">Loading...</p> : rows.length === 0 ? <p className="text-sm text-gray-500">No applications yet.</p> : (
          <AdminTable headers={["Name", "Contact", "Position", "Images", "Date", "Actions"]}>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-3 font-medium">{row.name}</td>
                <td className="px-3 py-3 text-gray-700">
                  <p>{row.phone}</p>
                  <p className="text-xs">{row.email}</p>
                </td>
                <td className="px-3 py-3 text-gray-700">{row.position}</td>
                <td className="px-3 py-3 text-xs text-gray-700">
                  <p>Profile: {row.profile_image}</p>
                  <p>Voucher: {row.voucher_image}</p>
                </td>
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
