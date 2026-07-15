"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  Send,
  MoreVertical,
  Plus,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatDate } from "@/lib/utils";
import { getConversationMessages, sendMessage } from "@/actions/member/chat-actions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
  online?: boolean;
}

interface Conversation {
  id: string;
  partner: User;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt?: Date | null;
}

interface Props {
  initialConversations: Conversation[];
  currentUser: { id: string };
}

export function ChatClient({ initialConversations, currentUser }: Props) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
      setMobileView("chat");
    }
  }, [activeConv]);

  const fetchMessages = async (convId: string) => {
    setLoading(true);
    const res = await getConversationMessages(convId);
    if (res.success && res.data) {
      setMessages(res.data as any);
      // Mark as read locally
      setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)));
    }
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Optimistic update
    const tempId = Math.random().toString();
    const optimisticMsg: Message = {
      id: tempId,
      senderId: currentUser.id,
      content,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const res = await sendMessage({
      receiverId: activeConv.partner.id,
      content,
      conversationId: activeConv.id,
    });

    if (!res.success) {
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } else {
      // Replace optimistic message with real one
      setMessages((prev) => prev.map((m) => (m.id === tempId ? (res.data as any) : m)));

      // Update conversations list
      setConversations((prev) => {
        const otherConvs = prev.filter((c) => c.id !== activeConv.id);
        const updatedActive = {
          ...activeConv,
          lastMessage: content,
          time: "Just now",
        };
        return [updatedActive, ...otherConvs];
      });
    }
    setSending(false);
  };

  return (
    <div className="surface-card flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-[2.5rem] border border-border/50 shadow-2xl">
      {/* Sidebar - Conversations List */}
      <div
        className={cn(
          "flex w-full flex-col border-r border-border/50 bg-surface-card transition-all md:w-80 lg:w-96",
          mobileView === "chat" ? "hidden md:flex" : "flex",
        )}
      >
        <div className="space-y-6 p-8">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-foreground">Talks</h1>
            <Button
              aria-label="New message"
              size="icon"
              variant="ghost"
              className="h-12 w-12 rounded-2xl border border-border/50 bg-surface-sunken transition-all hover:bg-surface-elevated"
            >
              <Plus className="h-6 w-6 text-brand-orange" />
            </Button>
          </div>

          <div className="group relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-tertiary transition-colors group-focus-within:text-brand-orange" />
            <Input
              placeholder="Search conversations..."
              className="h-12 rounded-2xl border-border/50 bg-surface-sunken pl-11 text-sm focus:border-brand-orange/50"
            />
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-2">
          {conversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken">
                <MessageSquare className="h-8 w-8 text-txt-tertiary" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-txt-tertiary">
                No messages yet
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={cn(
                  "group relative mb-2 flex cursor-pointer items-center gap-4 rounded-[1.5rem] p-4 transition-all",
                  activeConv?.id === conv.id
                    ? "border border-brand-orange/20 bg-brand-orange/10"
                    : "border border-transparent hover:bg-surface-sunken",
                )}
              >
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-surface-elevated font-bold text-brand-navy shadow-lg transition-transform group-hover:scale-105">
                    {conv.partner.avatar ? (
                      <img
                        src={conv.partner.avatar}
                        alt={conv.partner.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      conv.partner.name[0]
                    )}
                  </div>
                  {conv.partner.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-4 border-surface-card bg-success" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h4
                      className={cn(
                        "truncate font-bold transition-colors",
                        activeConv?.id === conv.id
                          ? "text-brand-orange"
                          : "text-foreground group-hover:text-brand-orange",
                      )}
                    >
                      {conv.partner.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase text-txt-tertiary">
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate pr-4 text-xs font-medium text-txt-secondary">
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="min-w-[1.25rem] rounded-lg bg-brand-orange px-2 py-0.5 text-center text-[10px] font-black text-white shadow-lg shadow-brand-orange/20">
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

      {/* Main Chat Area */}
      <div
        className={cn(
          "flex flex-1 flex-col bg-surface-sunken/10 transition-all",
          mobileView === "list" ? "hidden md:flex" : "flex",
        )}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-border/50 bg-surface-card p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileView("list")}
                  className="rounded-xl bg-surface-sunken p-2 text-txt-tertiary md:hidden"
                  aria-label="Back to conversations"
                  title="Back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="h-12 w-12 overflow-hidden rounded-2xl border border-border/50 bg-surface-elevated">
                  {activeConv.partner.avatar ? (
                    <img
                      src={activeConv.partner.avatar}
                      alt={activeConv.partner.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-brand-navy">
                      {activeConv.partner.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold leading-tight text-foreground">
                    {activeConv.partner.name}
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                    {activeConv.partner.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-txt-tertiary hover:text-foreground"
                  aria-label="Search messages"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-txt-tertiary hover:text-foreground"
                  aria-label="More options"
                  title="Options"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages Content */}
            <div
              ref={scrollRef}
              className="custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-sunken/50 to-transparent p-8"
            >
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border/50 bg-surface-card shadow-xl">
                    <MessageSquare className="h-10 w-10 text-brand-orange" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">Say Hello!</h4>
                  <p className="mt-2 max-w-[240px] text-sm text-txt-tertiary">
                    Start your conversation with {activeConv.partner.name}.
                  </p>
                </div>
              ) : (
                messages.map((msg, _idx) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex max-w-[80%] flex-col",
                        isMine ? "ml-auto items-end" : "mr-auto items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-3xl p-4 text-sm font-medium shadow-lg",
                          isMine
                            ? "rounded-tr-none bg-brand-orange text-white"
                            : "rounded-tl-none border border-border/50 bg-surface-card text-foreground",
                        )}
                      >
                        {msg.content}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 px-2">
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-txt-tertiary">
                          {mounted
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </span>
                        {isMine &&
                          (msg.readAt ? (
                            <CheckCheck className="h-3 w-3 text-brand-orange" />
                          ) : (
                            <Check className="h-3 w-3 text-txt-tertiary" />
                          ))}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 bg-surface-card p-8">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 shrink-0 rounded-2xl bg-surface-sunken text-txt-tertiary transition-all hover:bg-brand-orange/10 hover:text-brand-orange"
                  aria-label="Attach file"
                  title="Attach"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <div className="relative flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="h-12 w-full rounded-[1.5rem] border-none bg-surface-sunken px-6 pr-12 font-medium ring-brand-orange/20 focus:ring-2"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary transition-colors hover:text-brand-orange"
                    aria-label="Add emoji"
                    title="Emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="hover:bg-brand-orange-dark group h-12 w-12 shrink-0 rounded-2xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20 transition-all active:scale-95"
                >
                  <Send
                    className={cn(
                      "h-5 w-5 transition-transform",
                      sending
                        ? "animate-pulse"
                        : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                    )}
                  />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-sunken/50 to-transparent p-12 text-center">
            <div className="animate-bounce-slow mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-border/50 bg-surface-card shadow-2xl shadow-brand-orange/5">
              <MessageSquare className="h-12 w-12 text-brand-orange" />
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground">
              Your <span className="text-brand-orange">Lounge</span>
            </h2>
            <p className="max-w-[320px] text-sm font-medium leading-relaxed text-txt-tertiary">
              Connect with your personal trainer or gym support. Select a conversation to start the
              dialogue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
