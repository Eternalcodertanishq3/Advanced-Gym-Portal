"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fetches messages for a specific conversation.
 */
export async function getConversationMessages(conversationId: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        readAt: null,
      },
      data: {
        readAt: new Date(),
        readBy: {
          push: session.user.id,
        },
      },
    });

    return { success: true, data: messages };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { success: false, error: "Database error" };
  }
}

/**
 * Sends a message in a conversation.
 * If no conversation exists between two users, it creates one.
 */
export async function sendMessage({
  receiverId,
  content,
  conversationId,
}: {
  receiverId: string;
  content: string;
  conversationId?: string;
}) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    let targetConversationId = conversationId;

    // If no conversationId provided, try to find an existing one or create a new one
    if (!targetConversationId) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          participantIds: {
            hasEvery: [session.user.id, receiverId],
          },
        },
      });

      if (existingConversation) {
        targetConversationId = existingConversation.id;
      } else {
        const newConversation = await prisma.conversation.create({
          data: {
            participantIds: [session.user.id, receiverId],
          },
        });
        targetConversationId = newConversation.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: targetConversationId,
        senderId: session.user.id,
        receiverId,
        content,
      },
    });

    // Update conversation updatedAt for sorting
    await prisma.conversation.update({
      where: { id: targetConversationId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/member/messages");
    return { success: true, data: message };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Database error" };
  }
}
