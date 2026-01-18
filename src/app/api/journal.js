"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getMoodById, MOODS } from "../(main)/lib/mood";
import { getMoodImage } from "./public";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import aj from "@/lib/arcJet";
import { toast } from "sonner";
export async function createJournalEntry(data) {
  console.log(data, "data in create journal entry");
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized User");
    }

    // Arcjet rate limitng
    const req = await request();
    const decision = await aj.protect(req, {
      userId,
      requested: 1
    })
    // console.log(decision);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit) {
        const { remaining, reset } = decision.reason;

        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          }
        });

        toast.error("Too Many requests please try again later")
        console.log("Arject RAte limiting Failed")
        throw new Error("Too Many requests please try again later")
      }
      throw new Error("Request Blocked");
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId
      }
    });

    if (!user) {
      throw new Error("User not Found");
    }

    const mood = MOODS[data.mood.toUpperCase()];

    if (!mood) {
      throw new Error("Invalid mood");
    }
    // console.log(mood);
    const moodImage = await getMoodImage(mood.pixabayQuery);

    const entry = await prisma.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl: moodImage,
        collectionId: data.collectionId || null,
        userId: user.id
      }
    });
    // console.log(entry, "entry");
    await prisma.draft.deleteMany({
      where: {
        userId: user.id
      }
    });

    revalidatePath('/dashboard');
    return entry
  } catch (error) {
    throw new Error(error);
  }


}

export async function getJournalEntry({ collectionId, orderBy = 'desc' } = {}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId
      }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const entries = await prisma.entry.findMany({
      where: {
        userId: user.id,
        ...(collectionId === 'unorganized'
          ? { collectionId: null }
          : collectionId
            ? { collectionId }
            : {}
        )
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: orderBy
      }
    });

    const entriesWithMoodData = entries.map((entry, idx) => ({
      ...entry,
      moodData: getMoodById(entry.mood),
    }));

    return {
      success: true,
      data: {
        entries: entriesWithMoodData
      }
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getJournalEntryById(id) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId
      }
    });

    if (!user) {
      return null;
    }

    const entry = await prisma.entry.findFirst({
      where: {
        id,
        userId: user.id
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!entry) {
      return null;
    }

    return entry
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return null;
  }
}

export async function deleteJournal(entryId) {
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

    const entry = await prisma.entry.delete({
      where: {
        id: entryId
      },
    });

    if (!entry) {
      throw new Error("Entry not Found")
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateJournalEntry(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.entry.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (!existingEntry) throw new Error("Entry not found");

    // Get mood data
    const mood = MOODS[data.mood.toUpperCase()];
    if (!mood) throw new Error("Invalid mood");

    // Get new mood image if mood changed
    let moodImageUrl = existingEntry.moodImageUrl;
    if (existingEntry.mood !== mood.id) {
      moodImageUrl = await getMoodImage(data.moodQuery);
    }

    // Update the entry
    const updatedEntry = await prisma.entry.update({
      where: { id: data.id },
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl,
        collectionId: data.collectionId || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/journal/${data.id}`);
    return updatedEntry;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDraft() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await prisma.draft.findUnique({
      where: { userId: user.id },
    });

    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function saveDraft(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const draft = await prisma.draft.upsert({
      where: { userId: user.id },
      create: {
        title: data.title,
        content: data.content,
        mood: data.mood,
        userId: user.id,
      },
      update: {
        title: data.title,
        content: data.content,
        mood: data.mood,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: draft };
  } catch (error) {
    return { success: false, error: error.message };
  }
}