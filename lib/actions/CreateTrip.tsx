"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Server action to create a Trip with robust session -> userId resolution:
 * 1) getServerSession(authOptions) -> session.user.id
 * 2) session.user.email -> lookup user by email
 * 3) cookie fallback: read NextAuth session cookie and lookup Session row in DB
 */
export async function CreateTrip(formData: FormData) {
  // 1) Try the normal way
  const session = await getServerSession(authOptions);
  console.log("CreateTrip - getServerSession ->", !!session, JSON.stringify(session?.user ?? null));

  // helper to return redirect to sign in
  const toSignin = () => redirect("/api/auth/signin");

  if (!session) {
    // no session object at all - try cookie fallback below
    console.warn("CreateTrip - no session from getServerSession()");
  }

  // Try user id from session directly
  let userId: string | undefined = (session?.user as any)?.id as string | undefined;

  // 2) If no id, but email is present, lookup user by email
  if (!userId && session?.user?.email) {
    const u = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (u) {
      userId = u.id;
      console.log("CreateTrip - resolved userId by email:", userId);
    } else {
      console.warn("CreateTrip - session email present but no user found with that email");
    }
  }

  // 3) Cookie fallback: check likely cookie names for NextAuth session token and read Session table
  if (!userId) {
    try {
      const cookieStore = cookies();
      // common cookie names NextAuth uses (dev vs secure cookie)
      const cookieCandidates = [
        "__Secure-next-auth.session-token",
        "next-auth.session-token",
        "next-auth.session-token", // keep as duplicate—safe
        // Some NextAuth versions use "next-auth.callback-url" or other cookies — we look for session-like tokens
      ];

      // find any cookie that exists in the store
      let foundToken: string | undefined;
      for (const name of cookieCandidates) {
        const c = cookieStore.get(name);
        if (c?.value) {
          foundToken = c.value;
          console.log("CreateTrip - found session cookie:", name);
          break;
        }
      }

      // Some setups store token under "__Secure-next-auth.session-token" only when HTTPS; dev often uses "next-auth.session-token".
      if (!foundToken) {
        // fallback: inspect all cookies server-side (for debugging)
        const allCookies = cookieStore.getAll();
        console.log("CreateTrip - all cookies:", allCookies.map((c) => ({ name: c.name })));
        // try to heuristically find a cookie with long value (session token)
        const longCookie = allCookies.find((c) => (c.value?.length ?? 0) > 40);
        if (longCookie) {
          foundToken = longCookie.value;
          console.log("CreateTrip - heuristic found token cookie:", longCookie.name);
        }
      }

      if (foundToken) {
        // lookup session row in DB using sessionToken
        const sessionRow = await prisma.session.findUnique({
          where: { sessionToken: foundToken },
          select: { userId: true, id: true, expires: true },
        });
        console.log("CreateTrip - sessionRow from DB:", sessionRow ?? null);
        if (sessionRow?.userId) {
          userId = sessionRow.userId;
          console.log("CreateTrip - resolved userId from Session row:", userId);
        } else {
          console.warn("CreateTrip - no session row matched token or no userId in session row");
        }
      } else {
        console.warn("CreateTrip - no session cookie token found in request cookies");
      }
    } catch (err) {
      console.error("CreateTrip - cookie fallback error:", err);
    }
  }

  // final guard: if still no userId, redirect to signin
  if (!userId) {
    console.warn("CreateTrip - could not determine userId; redirecting to signin");
    return toSignin();
  }

  // Read form fields (ensure names match the form)
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString()?.trim() ?? "";
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  if (!title || !startDateStr || !endDateStr) {
    const msg = encodeURIComponent("Please fill title, start date and end date");
    return redirect(`/trips/new?error=${msg}`);
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    const msg = encodeURIComponent("Invalid start or end date");
    return redirect(`/trips/new?error=${msg}`);
  }

  await prisma.trip.create({
    data: {
      title,
      description,
      imageUrl: imageUrl || undefined,
      startDate,
      endDate,
      userId,
    },
  });

  return redirect("/trips?created=1");
}
