"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  byStatus: Record<string, number>;
  revenueTotal: string;
  upcoming: {
    id: string;
    customerName: string;
    eventDate: string;
    serviceType: string;
  }[];
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then(setStats)
      .catch(() => setError("Could not load stats"));
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  if (!stats) {
    return <p className="text-cocoa-600">Loading…</p>;
  }

  const statusOrder = [
    "new",
    "pending_payment",
    "paid",
    "confirmed",
    "completed",
    "cancelled",
  ];
  const statusLabels: Record<string, string> = {
    new: "New",
    pending_payment: "Pending Payment",
    paid: "Paid",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa-700">Dashboard</h1>
      <p className="mt-2 text-sm text-cocoa-600">
        Overview of bookings, revenue, and upcoming dates.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-cream-300/80 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase text-blush-500">
            Paid revenue
          </p>
          <p className="mt-2 font-serif text-2xl text-cocoa-700">
            ${Number(stats.revenueTotal).toLocaleString()}
          </p>
        </div>
        {statusOrder.map((s) => (
          <div
            key={s}
            className="rounded-2xl border border-cream-300/80 bg-white p-6 shadow-card"
          >
            <p className="text-xs font-semibold uppercase text-cocoa-500">
              {statusLabels[s] ?? s}
            </p>
            <p className="mt-2 font-serif text-2xl text-cocoa-700">
              {stats.byStatus[s] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-cocoa-700">Upcoming bookings</h2>
          <Link href="/admin/bookings" className="text-sm font-semibold text-blush-500">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-cream-300/80 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-cream-100/80 text-xs uppercase text-cocoa-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Service</th>
              </tr>
            </thead>
            <tbody>
              {stats.upcoming.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-cocoa-500">
                    No upcoming bookings
                  </td>
                </tr>
              ) : (
                stats.upcoming.map((b) => (
                  <tr key={b.id} className="border-t border-cream-200">
                    <td className="px-4 py-3 text-cocoa-700">{b.customerName}</td>
                    <td className="px-4 py-3 text-cocoa-600">
                      {new Date(b.eventDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-cocoa-600">
                      {b.serviceType.replaceAll("_", " ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
