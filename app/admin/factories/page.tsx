"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/Button";
import { Badge } from "@/src/components/Badge";
import { ConfirmModal } from "@/src/components/admin/ConfirmModal";
import type { AdminFactory } from "@/src/types/admin";

const statusVariant: Record<string, "default" | "success" | "warning" | "error"> = {
  pending: "warning",
  approved: "success",
  declined: "error",
};

export default function AdminFactoriesPage() {
  const router = useRouter();
  const [factories, setFactories] = useState<AdminFactory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    factoryId: number;
    factoryName: string;
    action: "approved" | "declined";
  }>({ isOpen: false, factoryId: 0, factoryName: "", action: "approved" });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchFactories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", limit.toString());
      params.set("offset", ((page - 1) * limit).toString());

      const res = await fetch(`/api/admin/factories?${params}`);
      const data = await res.json();
      setFactories(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching factories:", error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFactories();
  }, [fetchFactories]);

  const handleStatusAction = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/admin/factories/${actionModal.factoryId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: actionModal.action }),
        }
      );

      if (res.ok) {
        setActionModal({ isOpen: false, factoryId: 0, factoryName: "", action: "approved" });
        fetchFactories();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">🏭 Factories</h1>
          <p className="text-slate-500 text-sm">
            Manage factory listings and approvals
          </p>
        </div>
        <Link href="/admin/factories/new">
          <Button>+ Add Factory</Button>
        </Link>
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
              placeholder="Search factories..."
              className="w-full p-3 bg-transparent outline-none text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 ring-emerald-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : factories?.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No factories found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Factory
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Workers
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {factories?.map((factory) => (
                  <tr
                    key={factory.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition"
                  >
                    <td className="p-4">
                      <p className="font-medium text-slate-800 text-sm">
                        {factory.name}
                      </p>
                      {factory.regNumber && (
                        <p className="text-xs text-slate-400">
                          Reg: {factory.regNumber}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600">
                        {[factory.district, factory.province]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600">
                        {factory.workers?.toLocaleString() || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant[factory.status]}>
                        {factory.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/factories/${factory.id}/edit`}>
                          <button className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition">
                            Edit
                          </button>
                        </Link>
                        {factory.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                setActionModal({
                                  isOpen: true,
                                  factoryId: factory.id,
                                  factoryName: factory.name,
                                  action: "approved",
                                })
                              }
                              className="text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                setActionModal({
                                  isOpen: true,
                                  factoryId: factory.id,
                                  factoryName: factory.name,
                                  action: "declined",
                                })
                              }
                              className="text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                            >
                              Decline
                            </button>
                          </>
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
      <ConfirmModal
        isOpen={actionModal.isOpen}
        title={`${actionModal.action === "approved" ? "Accept" : "Decline"} Factory`}
        message={`Are you sure you want to ${actionModal.action === "approved" ? "accept" : "decline"} "${actionModal.factoryName}"?`}
        confirmLabel={actionModal.action === "approved" ? "Accept" : "Decline"}
        variant={actionModal.action === "approved" ? "primary" : "danger"}
        onConfirm={handleStatusAction}
        onCancel={() =>
          setActionModal({ isOpen: false, factoryId: 0, factoryName: "", action: "approved" })
        }
        isLoading={actionLoading}
      />
    </div>
  );
}
