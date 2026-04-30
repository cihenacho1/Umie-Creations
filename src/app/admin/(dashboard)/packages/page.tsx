"use client";

import { useEffect, useState } from "react";
import type { ServicePackage, ServiceType } from "@prisma/client";

const serviceTypes: ServiceType[] = [
  "EVENT_DECOR",
  "CHRISTMAS_TREE",
  "BOUQUET_FLOWERS",
  "CHOCOLATE_TREATS",
];

export default function AdminPackagesPage() {
  const [rows, setRows] = useState<ServicePackage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ServicePackage | null>(null);

  const emptyForm = {
    serviceType: "EVENT_DECOR" as ServiceType,
    name: "",
    description: "",
    price: 0,
    depositPercent: 30,
    isCustomQuote: false,
    isActive: true,
  };
  const [form, setForm] = useState(emptyForm);

  function load() {
    fetch("/api/admin/packages")
      .then((r) => {
        if (!r.ok) throw new Error("fail");
        return r.json();
      })
      .then(setRows)
      .catch(() => setError("Could not load"));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/packages/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          depositPercent: Number(form.depositPercent),
        }),
      });
    } else {
      await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          depositPercent: Number(form.depositPercent),
        }),
      });
    }
    setEditing(null);
    setForm(emptyForm);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    load();
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa-700">Packages</h1>

      <form
        onSubmit={save}
        className="mt-8 grid gap-4 rounded-2xl border border-cream-300/80 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="md:col-span-2 font-medium text-cocoa-700">
          {editing ? "Edit package" : "Add package"}
        </h2>
        <label className="text-sm">
          Service type
          <select
            className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
            value={form.serviceType}
            onChange={(e) =>
              setForm({ ...form, serviceType: e.target.value as ServiceType })
            }
          >
            {serviceTypes.map((t) => (
              <option key={t} value={t}>
                {t.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Name
          <input
            className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="md:col-span-2 text-sm">
          Description
          <textarea
            rows={2}
            className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>
        <label className="text-sm">
          Price (USD)
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            min={0}
          />
        </label>
        <label className="text-sm">
          Deposit %
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
            value={form.depositPercent}
            onChange={(e) =>
              setForm({ ...form, depositPercent: Number(e.target.value) })
            }
            min={0}
            max={100}
          />
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.isCustomQuote}
            onChange={(e) =>
              setForm({ ...form, isCustomQuote: e.target.checked })
            }
          />
          Custom quote (no online payment)
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active on site
        </label>
        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-blush-400 px-6 py-2 text-sm font-semibold text-white"
          >
            {editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button
              type="button"
              className="rounded-full border border-cream-300 px-6 py-2 text-sm"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 overflow-x-auto rounded-2xl border border-cream-300/80 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream-100/80 text-xs uppercase text-cocoa-500">
            <tr>
              <th className="px-3 py-2">Service</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Deposit %</th>
              <th className="px-3 py-2">Flags</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-cream-200">
                <td className="px-3 py-2 text-cocoa-600">
                  {p.serviceType.replaceAll("_", " ")}
                </td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">${Number(p.price)}</td>
                <td className="px-3 py-2">{p.depositPercent}</td>
                <td className="px-3 py-2 text-xs text-cocoa-500">
                  {p.isCustomQuote && "custom "}
                  {!p.isActive && "inactive"}
                </td>
                <td className="space-x-2 px-3 py-2 text-right">
                  <button
                    type="button"
                    className="text-blush-600 text-xs font-semibold"
                    onClick={() => {
                      setEditing(p);
                      setForm({
                        serviceType: p.serviceType,
                        name: p.name,
                        description: p.description,
                        price: Number(p.price),
                        depositPercent: p.depositPercent,
                        isCustomQuote: p.isCustomQuote,
                        isActive: p.isActive,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => void remove(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
