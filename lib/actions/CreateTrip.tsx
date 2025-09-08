"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createTrip(data: {
  title: string;
  description: string;
  imageUrl: string;
  startDate: Date;
  endDate?: Date;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  return prisma.trip.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      userId: session.user.id,
    },
  });
}
