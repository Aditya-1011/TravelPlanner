// app/trips/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function TripsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-lg text-gray-600">
          You must be signed in to view your trips.
        </p>
      </div>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link
          href="/trips/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Create New Trip
        </Link>
      </div>

      {/* Trips List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(trips) && trips.length > 0 ? (
          trips.map((trip) => (
            <li
              key={trip.id}
              className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
            >
              <h2 className="text-xl font-semibold">{trip.title}</h2>
              <p className="text-gray-600 flex-grow">{trip.description}</p>

              {trip.imageUrl && (
                <img
                  src={trip.imageUrl}
                  alt={trip.title}
                  className="mt-2 w-full h-40 object-cover rounded-lg"
                />
              )}

              <p className="text-sm text-gray-500 mt-2">
                {trip.startDate
                  ? new Date(trip.startDate).toLocaleDateString()
                  : "No start date"}{" "}
                -{" "}
                {trip.endDate
                  ? new Date(trip.endDate).toLocaleDateString()
                  : "No end date"}
              </p>
            </li>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No trips found.{" "}
            <Link href="/trips/new" className="text-blue-600 underline">
              Create one
            </Link>
            .
          </p>
        )}
      </ul>
    </div>
  );
}
