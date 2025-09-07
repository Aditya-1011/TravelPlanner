"use server"

import { authOptions } from "../auth";
import { prisma } from "../prisma";
import { getServerSession } from "next-auth";   // ✅ import instead of defining
import { redirect } from "next/navigation";     // ✅ import redirect

export default async function CreateTrip(formdata: FormData) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("You must be logged in to create a trip");
    }

    const title = formdata.get("title")?.toString();
    const description = formdata.get("description")?.toString();
    const start = formdata.get("startDate")?.toString(); // ✅ use proper field names
    const end = formdata.get("endDate")?.toString();

    if (!title || !description || !start || !end) {
        throw new Error("All form fields are required");
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    await prisma.trip.create({
        data: {
            title,
            description,
            startDate,
            endDate,
            userId: session.user.id, // ✅ session.user.id available if added in next-auth callbacks
        },
    });

    redirect("/trips");
}
