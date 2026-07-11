"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Badge } from "@/src/components/Badge";

interface User {
  id: string;
  email: string;
  fullName: string;
  nickname: string | null;
  role: string;
  isAdmin: boolean;
  status: "active" | "blocked";
  emailVerified: string | null;
  createdAt: string;
}

const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  active: "success",
  blocked: "error",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    action: "active" | "blocked" | "promote";
  }>({ isOpen: false, userId: "", userName: "", action: "active" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", limit.toString());
      params.set("offset", ((page - 1) * limit).toString());

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  }, [search, statusFilter, page, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, newStatus: "active" | "blocked") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handlePromote = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: true }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">👥 Users</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage registered users
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden focus-within:ring-2 ring-emerald-500 transition">
            <span className="pl-3 text-slate-400 dark:text-slate-500">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search users..."
              className="w-full p-3 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="relative inline-block">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none border border-slate-200 dark:border-slate-600 rounded-xl pl-4 pr-10 py-2.5 text-sm font-medium bg-linear-to-b from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition cursor-pointer text-slate-800 dark:text-slate-200"
            >
              <option value="">All Statuses</option>
              <option value="active">✅ Active</option>
              <option value="blocked">🚫 Blocked</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12">
              <svg className="animate-spin h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : users?.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600">
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-center p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
                  >
                    <td className="p-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">{user.id}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                        {user.nickname || user.fullName}
                      </p>
                      {user.nickname && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {user.fullName}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant[user.status]}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {user.isAdmin ? (
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">Admin</span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">User</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/users/${user.id}/view`}>
                          <button className="text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition" title="View detail">
                            👁️
                          </button>
                        </Link>
                        {!user.isAdmin && (
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              userId: user.id,
                              userName: user.nickname || user.fullName,
                              action: "promote",
                            })}
                            className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg transition"
                          >
                            ⬆️ Promote
                          </button>
                        )}
                        {user.status === "active" ? (
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              userId: user.id,
                              userName: user.nickname || user.fullName,
                              action: "blocked",
                            })}
                            className="text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-lg transition"
                          >
                            🚫 Block
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              userId: user.id,
                              userName: user.nickname || user.fullName,
                              action: "active",
                            })}
                            className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 px-3 py-1.5 rounded-lg transition"
                          >
                            ✓ Unblock
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
          <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-800 dark:text-slate-200 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-800 dark:text-slate-200 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirmModal.isOpen && createPortal(
        <div className="fixed z-50 top-24 left-1/2 -translate-x-1/2 w-full max-w-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden mx-4">
            <div className={`px-3 py-2 ${
              confirmModal.action === "blocked" ? "bg-linear-to-r from-red-500 to-rose-500" :
              confirmModal.action === "promote" ? "bg-linear-to-r from-emerald-500 to-teal-500" :
              "bg-linear-to-r from-emerald-500 to-teal-500"
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {confirmModal.action === "blocked" ? "⚠️" : confirmModal.action === "promote" ? "⬆️" : "✅"}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {confirmModal.action === "blocked" ? "Block User" : confirmModal.action === "promote" ? "Promote to Admin" : "Unblock User"}
                </h3>
              </div>
            </div>
            <div className="px-3 py-2">
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {confirmModal.action === "blocked"
                  ? `Are you sure you want to block "${confirmModal.userName}"? They won't be able to log in.`
                  : confirmModal.action === "promote"
                  ? `Are you sure you want to promote "${confirmModal.userName}" to admin? They will have full admin access.`
                  : `Are you sure you want to unblock "${confirmModal.userName}"?`}
              </p>
            </div>
            <div className="px-3 pb-3 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                  if (confirmModal.action === "promote") {
                    handlePromote(confirmModal.userId);
                  } else {
                    handleStatusChange(confirmModal.userId, confirmModal.action);
                  }
                }}
                className={`px-2 py-1 text-xs font-medium text-white rounded transition ${
                  confirmModal.action === "blocked"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {confirmModal.action === "blocked" ? "Block" : confirmModal.action === "promote" ? "Promote" : "Unblock"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
