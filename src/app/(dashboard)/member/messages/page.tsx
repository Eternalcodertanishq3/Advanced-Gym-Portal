import React from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MessageSquare, Search, Send, User, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      receiver: true
    }
  });

  // Group by conversation partner
  const conversationsMap = new Map();
  recentMessages.forEach(msg => {
    const partner = msg.senderId === session.user.id ? msg.receiver : msg.sender;
    if (!conversationsMap.has(partner.id)) {
      conversationsMap.set(partner.id, {
        id: partner.id,
        user: {
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
      id: member.trainer.user.id,
      user: {
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
    <div className="w-full h-[calc(100vh-120px)] flex overflow-hidden surface-card rounded-3xl border-none shadow-xl">
      {/* Sidebar - Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border/50 flex flex-col bg-surface-card">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-foreground">Messages</h1>
            <Button 
              aria-label="New message"
              size="icon" 
              variant="ghost" 
              className="rounded-xl bg-surface-sunken hover:bg-surface-elevated"
            >
              <Plus className="w-5 h-5 text-brand-orange" />
            </Button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary group-focus-within:text-brand-orange transition-colors" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10 bg-surface-sunken border-border/50 focus:border-brand-orange/50 rounded-xl"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xs text-txt-tertiary">No messages yet.</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.id}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-surface-sunken transition-colors border-l-4 border-transparent hover:border-brand-orange/30 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center font-bold text-brand-navy border border-border/50 overflow-hidden">
                    {conv.user.avatar ? (
                      <img src={conv.user.avatar} alt={conv.user.name} className="w-full h-full object-cover" />
                    ) : (
                      conv.user.name[0]
                    )}
                  </div>
                  {conv.user.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-surface-card" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-foreground truncate group-hover:text-brand-orange transition-colors">{conv.user.name}</h4>
                    <span className="text-[10px] font-medium text-txt-tertiary">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-txt-secondary truncate pr-4">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="bg-brand-orange text-white text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area - Placeholder */}
      <div className="hidden md:flex flex-1 flex-col bg-surface-sunken/30">
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 rounded-3xl bg-surface-card border border-border/50 flex items-center justify-center mb-6 shadow-xl shadow-brand-orange/5">
            <MessageSquare className="w-10 h-10 text-brand-orange" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Select a Conversation</h2>
          <p className="text-sm text-txt-tertiary max-w-[320px]">
            Choose a contact from the sidebar to start chatting with your trainer or the support staff.
          </p>
        </div>

        {/* Quick Send - Disabled for placeholder */}
        <div className="p-6 bg-surface-card border-t border-border/50">
          <div className="flex items-center gap-4 opacity-50 cursor-not-allowed">
            <div className="flex-1 relative">
              <Input 
                disabled
                placeholder="Type a message..." 
                className="bg-surface-sunken border-none rounded-xl pr-12"
              />
              <button 
                disabled 
                aria-label="Send message"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-brand-orange"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
