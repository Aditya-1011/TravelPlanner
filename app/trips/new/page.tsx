// app/trips/new/page.tsx
import React from "react";
import { CreateTrip } from "@/lib/actions/CreateTrip";

type Props = {
  searchParams?: { error?: string; created?: string };
};

export default function NewTripPage({ searchParams }: Props) {
  const error = searchParams?.error ? decodeURIComponent(searchParams.error) : null;
  const created = searchParams?.created;

  return (
    <main className="max-w-lg mx-auto mt-10 p-4">
      <h1 className="text-2xl font-semibold mb-4">Create a new trip</h1>

      {error ? (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-100 rounded">
          {error}
        </div>
      ) : null}

      {created ? (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-100 rounded">
          Trip created successfully.
        </div>
      ) : null}

      {/* NOTE: do NOT set method or encType when using a function action — React sets them */}
      <form action={CreateTrip} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input name="title" required className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" rows={3} className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL (optional)</label>
          <input name="imageUrl" className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input name="startDate" type="date" required className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input name="endDate" type="date" required className="mt-1 block w-full border rounded p-2" />
        </div>

        <div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">
            Create Trip
          </button>
        </div>
      </form>
    </main>
  );
}
