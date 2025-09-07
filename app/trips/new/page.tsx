"use client";

import { Card, CardHeader, CardContent } from "@/Component/ui/card";
import CreateTrip from "@/lib/actions/create-trip";
import { useTransition } from "react";

export default function NewTripPage() {
    const [pending,starttrsnition]=useTransition();
  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Trip</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" action={(formData:FormData)=>{
            starttrsnition(()=>{
                CreateTrip(formData);
            });
            
          }}>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Japan trip..."
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="desc"
                rows={4}
                placeholder="Trip Description..."
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Dates (side by side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={pending}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {pending?"Creating...":"Create Trip"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}