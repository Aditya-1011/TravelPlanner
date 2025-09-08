// app/trips/new/NewTripWrapper.tsx  (client)
"use client";
import { useSession, signIn } from "next-auth/react";
import NewTripForm from "./NewTripForm";

export default function NewTripWrapper() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div className="p-4">
        <p className="mb-4">You must sign in to create a trip.</p>
        <button
          onClick={() => signIn("github", { callbackUrl: "/trips/new" })}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return <NewTripForm />;
}
