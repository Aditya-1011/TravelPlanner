"use client";

import { useState } from "react";
import { createTrip } from "@/lib/actions/CreateTrip";
import { UploadButton } from "@uploadthing/react";


export default function NewTripForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createTrip({
      title,
      description,
      imageUrl,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });

    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setImageUrl("");
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">New Trip</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              placeholder="Japan trip..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              placeholder="Trip description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {/* Dates */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-gray-300 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-gray-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Trip Image</label>
            <div className="flex flex-col items-start">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setImageUrl(res?.[0]?.url || "");
                }}
                onUploadError={(err) => {
                  alert(`Upload failed: ${err.message}`);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">Image &lt; 4MB</p>
            </div>

            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Trip Preview"
                  className="w-40 h-28 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 text-sm font-medium"
          >
            Create Trip
          </button>
        </form>
      </div>
    </div>
  );
}
