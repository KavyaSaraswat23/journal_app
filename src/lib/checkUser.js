
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function checkUser() {
  const user = await currentUser();

  if (!user) {
    return null //checking for now
  }

  try {
    const isUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id
      }
    });

    if (isUser) {
      return isUser
    }


    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
        imageUrl: user.imageUrl,

      }
    });

    return newUser
  } catch (error) {
    console.log(error.message)
  }
}

