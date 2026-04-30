"use client";

import { useEffect, useMemo, useState } from "react";

type BookingRow = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceType: string;
  packageType: string;
  eventDate: string;
  eventTime: string;
  address: string;
  budgetRange: string | null;
  notes: string | null;
  inspirationImageUrl: string | null;
  paymentOption: string;
  paymentStatus: string;
  amount: string;
  status: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  new: "New",
  pending_payment: "Pending Payment",
  paid: "Paid",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const allStatuses = Object.keys(statusLabels);

function badge(status: string) {
  const base = "rounded-full px-2 py-0.5 text-xs font-semibold";
  if (status === "completed") return `${base} bg-green-100 text-green-800`;
  if (status === "cancelled") return `${base} bg-cocoa-200 text-cocoa-800`;
  if (status === "confirmed" || status === "paid")
    return `${base} bg-blush-100 text-blush-700`;
  if (status === "pending_payment") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-cream-200 text-cocoa-700`;
}

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/bookings")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(setRows)
      .catch(() => setError("Could not load bookings"));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      filter === "all" ? rows : rows.filter((r) => r.status === filter),
    [rows, filter]
  );

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa-700">Bookings</h1>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="text-sm text-cocoa-600">
          Filter:
          <select
            className="ml-2 rounded-lg border border-cream-300 bg-white px-2 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-cream-300/80 bg-white">
        <table className="min-w-[1000px] w-full text-left text-xs md:text-sm">
          <thead className="bg-cream-100/80 text-[10px] uppercase text-cocoa-500 md:text-xs">
            <tr>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Service</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-cream-200 align-top">
                <td className="px-3 py-2 font-medium text-cocoa-700">
                  {b.customerName}
                </td>
                <td className="px-3 py-2 text-cocoa-600">
                  {b.email}
                  <br />
                  {b.phone}
                </td>
                <td className="px-3 py-2 text-cocoa-600">
                  {b.serviceType.replaceAll("_", " ")}
                  <br />
                  <span className="text-cocoa-500">{b.packageType}</span>
                </td>
                <td className="px-3 py-2 text-cocoa-600">
                  {new Date(b.eventDate).toLocaleDateString()}
                  <br />
                  {b.eventTime}
                </td>
                <td className="px-3 py-2 text-cocoa-600">
                  {b.paymentOption}
                  <br />
                  <span className="text-cocoa-500">{b.paymentStatus}</span>
                </td>
                <td className="px-3 py-2 text-cocoa-700">
                  ${Number(b.amount).toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  <span className={badge(b.status)}>{statusLabels[b.status]}</span>
                  <select
                    className="mt-2 block w-full rounded border border-cream-300 text-[10px] md:text-xs"
                    value={b.status}
                    onChange={(e) => void updateStatus(b.id, e.target.value)}
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="max-w-[180px] px-3 py-2 text-cocoa-500 line-clamp-4">
                  {b.notes}
                  {b.address && (
                    <span className="mt-1 block text-[10px]">{b.address}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
