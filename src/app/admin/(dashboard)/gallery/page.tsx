"use client";

import { useEffect, useState } from "react";

import { normalizeGalleryImageUrl } from "@/lib/gallery-image-url";

type G = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string | null;
};

export default function AdminGalleryPage() {
  const [rows, setRows] = useState<G[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<G | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "event",
    imageUrl: "",
    description: "",
  });

  function load() {
    fetch("/api/admin/gallery")
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
    const payload = {
      title: form.title,
      category: form.category,
      imageUrl: form.imageUrl,
      description: form.description || undefined,
    };
    if (editing) {
      await fetch(`/api/admin/gallery/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setEditing(null);
    setForm({ title: "", category: "event", imageUrl: "", description: "" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete gallery item?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    load();
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl text-cocoa-700">Gallery</h1>
      <p className="mt-2 text-sm text-cocoa-600">
        Paste image URLs (e.g. from your CDN or licensed stock). Replace
        Unsplash placeholders when you go live.
      </p>

      <form
        onSubmit={save}
        className="mt-8 space-y-4 rounded-2xl border border-cream-300/80 bg-white p-6"
      >
        <h2 className="font-medium text-cocoa-700">
          {editing ? "Edit item" : "Add item"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Title
            <input
              className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label className="text-sm">
            Category
            <input
              className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </label>
          <label className="md:col-span-2 text-sm">
            Image URL
            <input
              className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              required
            />
          </label>
          <label className="md:col-span-2 text-sm">
            Description
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border border-cream-300 px-2 py-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
        </div>
        <div className="flex gap-2">
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
                setForm({
                  title: "",
                  category: "event",
                  imageUrl: "",
                  description: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((g) => (
          <div
            key={g.id}
            className="overflow-hidden rounded-2xl border border-cream-300/80 bg-white shadow-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalizeGalleryImageUrl(g.imageUrl)}
              alt={g.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <p className="font-serif text-lg text-cocoa-700">{g.title}</p>
              <p className="text-xs text-blush-500">{g.category}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="text-xs font-semibold text-blush-600"
                  onClick={() => {
                    setEditing(g);
                    setForm({
                      title: g.title,
                      category: g.category,
                      imageUrl: g.imageUrl,
                      description: g.description ?? "",
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-xs text-red-600"
                  onClick={() => void remove(g.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
