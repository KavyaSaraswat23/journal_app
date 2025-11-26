"use server"
import { prisma } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import aj from "@/lib/arcJet";
export async function createCollection(data) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized User");
    }

    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId
      }
    });

    if (!user) {
      throw new Error("User Doesn't exist");
    }
    const iscollectionExist = await prisma.collection.findFirst({
      where: {
        name: data.name
      }
    });

    if (iscollectionExist) {
      throw new Error("Collection with this name already exist");
    }
    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        description: data.description,
        userId: user.id,
      },
    });
    console.log(collection, "collection")
    // check here
    revalidatePath("/dashboard");
    return collection;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCollections() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized User");
    }

    const user = await prisma.user.findUnique({
      where: {

        clerkUserId: userId
      }
    });

    if (!user) {
      throw new Error("User Doesn't exist");
    }

    const collection = await prisma.collection.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: 'desc' }
    });
    return collection;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteCollections() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized User");
    }

    const user = await prisma.user.findUnique({
      where: {

        clerkUserId: userId
      }
    });

    if (!user) {
      throw new Error("User Doesn't exist");
    }

    const collection = await prisma.collection.delete({
      where: {
        userId: user.id,
      },
    });

    if (!collection){
      throw new Error("Collecton not Found")
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
