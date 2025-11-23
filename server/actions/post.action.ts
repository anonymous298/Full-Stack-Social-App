"use server"

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
    try {
        const userId = await getDbUserId()

        if (!userId) return;

        const post = await prisma.post.create(
            {
                data : {
                    content,
                    image,
                    authorId: userId,
                },
            }
        )

        revalidatePath('/');

        return {success: true, post}


    } catch (error) {
        console.log('Failed to create post', error)
        return {success: false, error : "Failed to create a post"}
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany(
            {
                orderBy : {
                    createdAt : 'desc'
                },

                include : {
                    author : {
                        select : {
                            id : true,
                            clerkId: true,
                            name: true,
                            username : true,
                            image : true
                        }
                    },

                    comments : {
                        include : {
                            author : {
                                select : {
                                    id: true,
                                    name: true,
                                    username: true,
                                    image: true
                                }
                            }
                        },

                        orderBy : {
                            createdAt : 'asc'
                        }
                    },

                    likes : {
                        select : {
                            userId: true
                        }
                    },

                    _count : {
                        select : {
                            likes: true,
                            comments: true
                        }
                    }
                }
            }
        );

        // if (posts.length === 0) return;

        return posts;

    } catch (error) {
        console.log('Error fetching posts', error);
        throw new Error("Error fetching posts");
    }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, // recipient (post author)
                  creatorId: userId, // person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function createComment(content: string, postId: string) {
    try {
        const userId = await getDbUserId();
        if (!userId) return;

        const post = await prisma.post.findUnique(
            {
                where : {
                    id: postId
                },
                select : {
                    authorId: true
                }
            }
        )

        if (!post) throw new Error('Post is not available');
        if (!content.trim()) throw new Error('Content is needed for making a comment');

        const [comment] = await prisma.$transaction(async (tx) => {

            const newComment = await tx.comment.create(
                {
                    data : {
                        content,
                        authorId: userId,
                        postId,
                    }
                }
            );

            if (post.authorId !== userId) {
                await tx.notification.create({
                    data : {
                        type: 'FOLLOW',
                        creatorId: userId,
                        userId: post.authorId,
                        commentId: newComment.id
                    }
                })
            }

            return [newComment];
        })

        revalidatePath('/');

        return {success : true, comment}


    } catch (error) {
        console.log('Error Creating a comment');
        return {success: false}
    }
}

export async function deletePost(postId: string) {
    try {

        await prisma.post.delete(
            {
                where : {
                    id : postId
                }
            }
        )

        revalidatePath('/')

        return {success : true}
    } catch (error) {
        console.log('Error Deleting the post');
        return {success : false}
    }
}
