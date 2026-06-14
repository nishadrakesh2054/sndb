"use client";

import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaEnvelope,
  FaPen,
  FaPhone,
  FaTimes,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import {
  AdminAlert,
  AdminCard,
  AdminPageHeader,
} from "@/components/admin/AdminUi";
import {
  btnDangerClass,
  btnIconClass,
  btnIconDangerClass,
  btnSecondaryClass,
} from "@/lib/admin/config";
import { getMembershipFileSignedUrl } from "@/utils/supabase/membership";
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

type RowImageUrls = {
  profile: string;
  voucher: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function ApplicationsAdmin() {
  const [rows, setRows] = useState<MembershipApplication[]>([]);
  const [selected, setSelected] = useState<MembershipApplication | null>(null);
  const [selectedImages, setSelectedImages] = useState<RowImageUrls | null>(null);
  const [rowImages, setRowImages] = useState<Record<string, RowImageUrls>>({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("membership_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setRows((data ?? []) as MembershipApplication[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (rows.length === 0) {
      setRowImages({});
      return;
    }

    let cancelled = false;

    const loadImages = async () => {
      const entries = await Promise.all(
        rows.map(async (row) => {
          try {
            const [profile, voucher] = await Promise.all([
              getMembershipFileSignedUrl(row.profile_image),
              getMembershipFileSignedUrl(row.voucher_image),
            ]);
            return [row.id, { profile, voucher }] as const;
          } catch {
            return [row.id, { profile: "", voucher: "" }] as const;
          }
        })
      );

      if (!cancelled) {
        setRowImages(Object.fromEntries(entries));
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [rows]);

  const openDetails = async (row: MembershipApplication) => {
    setSelected(row);
    setSelectedImages(null);
    setLoadingImages(true);

    try {
      const [profile, voucher] = await Promise.all([
        getMembershipFileSignedUrl(row.profile_image),
        getMembershipFileSignedUrl(row.voucher_image),
      ]);
      setSelectedImages({ profile, voucher });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load application images.",
      });
    } finally {
      setLoadingImages(false);
    }
  };

  const closeDetails = () => {
    setSelected(null);
    setSelectedImages(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("membership_applications").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setMessage({ type: "success", text: "Application deleted." });
    if (selected?.id === id) {
      closeDetails();
    }
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Membership Applications"
        description="Applications submitted through the register member form."
      />

      {message ? <AdminAlert type={message.type} message={message.text} /> : null}

      <AdminCard title={`Applications (${rows.length})`}>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">No applications yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Profile Photo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Voucher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-gray-50/80">
                    <td className="px-4 py-4 align-top font-semibold text-gray-900">
                      {row.name}
                    </td>
                    <td className="max-w-[180px] px-4 py-4 align-top">
                      <a
                        href={`mailto:${row.email}`}
                        className="break-all text-gray-700 hover:text-green-700"
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 align-top">
                      <a
                        href={`tel:${row.phone}`}
                        className="text-gray-700 hover:text-green-700"
                      >
                        {row.phone}
                      </a>
                    </td>
                    <td className="px-4 py-4 align-top text-gray-700">{row.position}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        {rowImages[row.id]?.profile ? (
                          <img
                            src={rowImages[row.id].profile}
                            alt={`${row.name} profile`}
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <FaUser className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="h-14 w-14 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        {rowImages[row.id]?.voucher ? (
                          <img
                            src={rowImages[row.id].voucher}
                            alt={`${row.name} voucher`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            —
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 align-top text-gray-500">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`View application from ${row.name}`}
                          title="View application"
                          className={btnIconClass}
                          onClick={() => openDetails(row)}
                        >
                          <FaPen className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete application from ${row.name}`}
                          title="Delete application"
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
          onClick={closeDetails}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                  Membership Application
                </p>
                <h2 className="mt-1 text-lg font-bold text-gray-900">{selected.name}</h2>
                <p className="mt-1 text-xs text-gray-500">{formatDate(selected.created_at)}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                className={btnIconClass}
                onClick={closeDetails}
              >
                <FaTimes className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <FaBriefcase className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-900">{selected.position}</span>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Profile Photo
                  </p>
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {loadingImages ? (
                      <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : selectedImages?.profile ? (
                      <img
                        src={selectedImages.profile}
                        alt={`${selected.name} profile`}
                        className="h-48 w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                        Image unavailable
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment Voucher
                  </p>
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {loadingImages ? (
                      <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : selectedImages?.voucher ? (
                      <img
                        src={selectedImages.voucher}
                        alt={`${selected.name} voucher`}
                        className="h-48 w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                        Image unavailable
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
              <button type="button" className={btnSecondaryClass} onClick={closeDetails}>
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
