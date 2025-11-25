"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { Prisma } from "@/app/generated/prisma/client";

// Fully type-safe Notification including relations
export type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        name: true | null;
        username: true;
        image: true | null;
        clerkId: true; // Added clerkId to match user type
      };
    };
    post: {
      select: {
        id: true;
        content: true;
        image: true | null;
      };
    };
    comment: {
      select: {
        id: true;
        content: true;
        createdAt: true;
        author: { // If comment has author, include clerkId
          select: {
            id: true;
            name: true;
            username: true;
            image: true | null;
            clerkId: true;
          };
        };
      };
    };
  };
}>;

// Fetch all notifications for the logged-in user
export async function getAllNotifications(): Promise<NotificationWithRelations[]> {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            clerkId: true, // Added clerkId
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                clerkId: true, // Added clerkId for comment author
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return notifications;
  } catch (error) {
    console.log("Error fetching notifications", error);
    throw new Error("Failed to fetch notifications");
  }
}

// Mark notifications as read
export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: { id: { in: notificationIds } },
      data: { read: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false };
  }
}
