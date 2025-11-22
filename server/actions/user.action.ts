import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return;

  const exisitingUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (exisitingUser) return exisitingUser;

  else {
    return await prisma.user.create({
      data: {
        clerkId: userId,
        name: user.emailAddresses[0].emailAddress.split("@")[0],
        username: `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
  }
}

export async function getUserByClerkId(clerkId: string) {
    try {
        const user = await auth()

        if (!user) return;
        
        const currentUser = await prisma.user.findUnique({
            where : {
                clerkId,
            },
            include : {
                _count : {
                    select : {
                        followers: true,
                        following: true,
                        posts: true
                    }
                }
            }
        })

        if (!currentUser) return;

        return currentUser

    } catch (error) {
        console.log('User does not exist by clerkID', error)
    }
}