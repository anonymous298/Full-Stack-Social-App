"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";


export async function getProfileByUsername(username: string) {
    try {
        if (!username) return;

        const user = await prisma.user.findUnique(
            {
                where : {
                    username,
                },

                select : {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                    bio: true,
                    location: true,
                    website: true,
                    createdAt: true,
                    _count : {
                        select : {
                            followers: true,
                            following: true,
                            posts: true
                        }
                    }
                }
            }
        )

        return user;

    } catch (error) {
        console.log('Error fetching user profile', error)
    }
}

export async function getUserPosts(userId: string) {
    try {
        if (!userId) return;

        const posts = await prisma.post.findMany({
            where: {
                authorId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return posts;

    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw new Error("Failed to fetch user posts");
    }

}

export async function getUserLikedPosts(userId: string) {
    try {
        if (!userId) return;

        const likedPosts = await prisma.post.findMany(
            {
                where : {
                    likes : {
                        some : {
                            userId,
                        }
                    }
                },

                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        },
                    },

                    comments: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    image: true,
                                },
                            },
                        },

                        orderBy: {
                            createdAt: "asc",
                        },
                    },

                    likes: {
                        select: {
                            userId: true,
                        },
                    },

                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },
            }
        )

        return likedPosts;

    } catch (error) {
        console.log("Error fetching likes posts", error)
        throw new Error("Failed to fetch liked posts");
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const {userId: clerkId} = await auth()
        if (!clerkId) throw new Error('Unauthorized');

        const name = formData.get("name") as string;
        const bio = formData.get("bio") as string;
        const location = formData.get('location') as string;
        const website = formData.get("website") as string;

        const dataForUpdation = {
            name,
            bio,
            location,
            website
        }

        const user = await prisma.user.update(
            {
                where : {
                    clerkId,
                },

                data : dataForUpdation
            }
        )

        revalidatePath('/')

        return {status : true, user}

    } catch (error) {
        console.log("Error updating the profile", error);
        return {success : false}
    }
}

export async function isFollowing(userId: string) {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return false;

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}
