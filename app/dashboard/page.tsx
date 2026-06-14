import Link from "next/link";
import { adminNav } from "@/lib/admin/config";

export default function DashboardHomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage all dynamic website content. Changes appear on the public site
          immediately.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminNav.slice(1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">{item.label}</h2>
            <p className="mt-2 text-sm text-green-700">Manage →</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Create admin users in Supabase → Authentication → Users, then run the{" "}
        <code className="rounded bg-white px-1">20260614_admin_rls.sql</code>{" "}
        migration if you have not already.
      </div>
    </div>
  );
}
