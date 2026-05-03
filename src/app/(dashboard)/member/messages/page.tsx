import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/chat-client";

export const metadata = {
  title: "Messages | Eagle Gym",
  description: "Chat with your trainer and gym staff.",
};

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      trainer: { include: { user: true } },
    }
  });

  const recentMessages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: true,
      receiver: true,
      conversation: true
    }
  });

  // Group by conversation partner
  const conversationsMap = new Map();
  recentMessages.forEach(msg => {
    const partner = msg.senderId === session.user.id ? msg.receiver : msg.sender;
    if (!conversationsMap.has(partner.id)) {
      conversationsMap.set(partner.id, {
        id: msg.conversationId,
        partner: {
          id: partner.id,
          name: `${partner.firstName} ${partner.lastName}`,
          role: partner.role,
          avatar: partner.avatar,
          online: false // Would need real-time tracking
        },
        lastMessage: msg.content,
        time: msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: msg.receiverId === session.user.id && !msg.readAt ? 1 : 0
      });
    }
  });

  const conversations = Array.from(conversationsMap.values());

  // Add trainer if not in conversations
  if (member?.trainer && !conversationsMap.has(member.trainer.user.id)) {
    conversations.unshift({
      id: "", // No conversation yet
      partner: {
        id: member.trainer.user.id,
        name: `${member.trainer.user.firstName} ${member.trainer.user.lastName}`,
        role: "My Trainer",
        avatar: member.trainer.user.avatar,
        online: false
      },
      lastMessage: "Start a conversation with your trainer.",
      time: "",
      unread: 0
    });
  }

  return (
    <div className="w-full h-full p-2 md:p-6">
      <ChatClient 
        initialConversations={conversations} 
        currentUser={{ id: session.user.id }} 
      />
    </div>
  );
}
