"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Admin {
  id: string;
  email: string;
  fullName: string;
  nickname: string | null;
  role: string;
  isSuperAdmin: boolean;
  status: "active" | "blocked";
  emailVerified: string | null;
  createdAt: string;
}

export default function AdminAdminsPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({ isOpen: false, userId: "", userName: "" });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("limit", limit.toString());
      params.set("offset", ((page - 1) * limit).toString());

      const res = await fetch(`/api/admin/admins?${params}`);
      const data = await res.json();
      setAdmins(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  }, [search, page, limit]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleDemote = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: false }),
      });

      if (res.ok) {
        fetchAdmins();
      }
    } catch (error) {
      console.error("Error demoting admin:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🛡️ Admins</h1>
        <p className="text-slate-500 text-sm">
          Manage administrator accounts
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 ring-emerald-500 transition">
            <span className="pl-3 text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search admins..."
              className="w-full p-3 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12">
              <svg className="animate-spin h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : admins?.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No admins found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins?.map((admin, index) => (
                  <tr
                    key={admin.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
                  >
                    <td className="p-4">
                      <span className="text-sm text-slate-500">{admin.id}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 text-sm">
                        {admin.nickname || admin.fullName}
                      </p>
                      {admin.nickname && (
                        <p className="text-xs text-slate-400">
                          {admin.fullName}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600">{admin.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded capitalize">
                        {admin.isSuperAdmin ? "Administrator (Super Admin)" : admin.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${admin.status === "active" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}>
                        {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/admins/${admin.id}/view`}>
                          <button className="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition" title="View detail">
                            👁️
                          </button>
                        </Link>
                        {!admin.isSuperAdmin && admin.email !== session?.user?.email && (
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              userId: admin.id,
                              userName: admin.nickname || admin.fullName,
                            })}
                            className="text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition"
                          >
                            ⬇️ Demote
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed z-50 top-24 left-1/2 -translate-x-1/2 w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
            <div className="px-3 py-2 bg-linear-to-r from-amber-500 to-orange-500">
              <div className="flex items-center gap-2">
                <span className="text-lg">⬇️</span>
                <h3 className="text-sm font-bold text-white">Demote Admin</h3>
              </div>
            </div>
            <div className="px-3 py-2">
              <p className="text-slate-600 text-xs leading-relaxed">
                Are you sure you want to demote "{confirmModal.userName}"? They will lose admin access and become a regular user.
              </p>
            </div>
            <div className="px-3 pb-3 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  handleDemote(confirmModal.userId);
                }}
                className="px-2 py-1 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded transition"
              >
                Demote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
