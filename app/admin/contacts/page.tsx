"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  ip: string | null;
  createdAt: string;
}

const statusConfig = {
  unread: { label: "Unread", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", dot: "bg-blue-500" },
  read: { label: "Read", color: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300", dot: "bg-slate-400" },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", dot: "bg-emerald-500" },
};

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number }>({
    isOpen: false,
    id: 0,
  });
  const limit = 10;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", limit.toString());
      params.set("offset", ((page - 1) * limit).toString());

      const res = await fetch(`/api/admin/contacts?${params}`);
      const data = await res.json();
      setMessages(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  }, [search, statusFilter, page, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusUpdate = async (id: number, newStatus: "unread" | "read" | "replied") => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}/status`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMessages();
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">✉️ Contact Messages</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          View and manage contact form submissions
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
              placeholder="Search messages..."
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
              <option value="">All Messages</option>
              <option value="unread">🔵 Unread</option>
              <option value="read">⚪ Read</option>
              <option value="replied">🟢 Replied</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
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
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No contact messages found
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
                    From
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${
                      msg.status === "unread" ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      #{msg.id}
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {msg.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {msg.email}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                      {msg.subject}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[msg.status].color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[msg.status].dot}`}></span>
                        {statusConfig[msg.status].label}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (msg.status === "unread") {
                            handleStatusUpdate(msg.id, "read");
                          }
                        }}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium transition"
                      >
                        View
                      </button>
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

      {/* Message Detail Modal */}
      {selectedMessage && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedMessage(null)}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusConfig[selectedMessage.status].dot}`}></span>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">From</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedMessage.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Email</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedMessage.email}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Date</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedMessage.ip && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">IP</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{selectedMessage.ip}</p>
                  </div>
                )}
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-sm">Message</span>
                <p className="mt-1 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setConfirmDelete({ isOpen: true, id: selectedMessage.id })}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                Delete
              </button>
              <div className="flex gap-2">
                {selectedMessage.status !== "unread" && (
                  <button
                    onClick={() => handleStatusUpdate(selectedMessage.id, "unread")}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
                  >
                    Mark Unread
                  </button>
                )}
                {selectedMessage.status !== "replied" && (
                  <button
                    onClick={() => handleStatusUpdate(selectedMessage.id, "replied")}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                  >
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete.isOpen && createPortal(
        <div className="fixed z-50 top-24 left-1/2 -translate-x-1/2 w-full max-w-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden mx-4">
            <div className="px-3 py-2 bg-linear-to-r from-red-500 to-orange-500">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <h3 className="text-sm font-bold text-white">Delete Message</h3>
              </div>
            </div>
            <div className="px-3 py-2">
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Are you sure you want to delete this contact message? This action cannot be undone.
              </p>
            </div>
            <div className="px-3 pb-3 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete({ isOpen: false, id: 0 })}
                className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmDelete({ isOpen: false, id: 0 });
                  handleDelete(confirmDelete.id);
                }}
                className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
