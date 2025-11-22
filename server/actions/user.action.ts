"use server"

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
        username: user.emailAddresses[0].emailAddress.split("@")[0],
        name: `${user.firstName || ""} ${user.lastName || ""}`,
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

export async function getDbUserId() {
  const {userId: clerkId} = await auth();

  if (!clerkId) return null;

  const currentUser = await getUserByClerkId(clerkId);

  if (!currentUser) return new Error("User not exists");

  return currentUser.id
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();

    const randomUsers = await prisma.user.findMany(
      {
        where : {
          AND : [
            {NOT : {id: userId}},
            {NOT : {
              followers : {
                some : {
                  followerId : userId
                }
              }
            }},
          ],
        },

        include : {
          _count : {
            select : {
              followers: true
            }
          }
        },

        // select : {
        //   id : true,
        //   name: true,
        //   username: true,
        //   image: true,
        //   _count : {
        //     select : {
        //       followers: true
        //     }
        //   }
          
        // },

        take : 3,

      }
    )

    return randomUsers
    
  } catch (error) {
    console.log('Error getting users', error)
    return []
  }
}

export async function toggleFollow(targetUserId) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (userId === targetUserId) throw new Error("You cannot follow yourself buddy.");

    const currentTargetedFollow = await prisma.follows.findUnique(
      {
        where : {
          followerId_followingId : {
            followerId : userId,
            followingId : targetUserId,
          }
        }
      }
    )

    if (currentTargetedFollow) {
      await prisma.follows.delete(
        {
          where : {
            followerId_followingId : {
              followerId : userId,
              followingId: targetUserId,
            }
          }
        }
      )
    }

    else {
      await prisma.$transaction(
        [
          prisma.follows.create(
            {
              data : {
                followerId : userId,
                followingId: targetUserId,
              }
            }
          ),

          prisma.notification.create(
            {
              data : {
                type : 'FOLLOW',
                creatorId: userId,
                userId : targetUserId
              }
            }
          )
        ]
      )
    }

    revalidatePath('/');

    return {success: true};

  } catch (error) {
    console.log('Error in following', error);
    return {success : false}
  }
} 