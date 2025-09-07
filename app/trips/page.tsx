// app/trips/page.tsx
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"; 
import { Button } from "@/Component/ui/button";
import Link from "next/link";
// fix path & casing

export default async function TripsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl">
        Please Sign In
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <Link href="/trips/new">
        <Button>New Trip</Button>
        <Button>Yes Trip</Button>
        </Link>
      </div>
    </div>
  );
}
