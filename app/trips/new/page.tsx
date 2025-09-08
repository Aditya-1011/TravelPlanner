// app/trips/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewTripForm from "./NewTripForm";

export default async function NewTripPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin"); // redirect to login if not signed in
  }

  return (
    <div >
      
      <NewTripForm />
    </div>
  );
}
