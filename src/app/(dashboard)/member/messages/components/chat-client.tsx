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
  ChevronLeft
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
      setConversations(prev => prev.map(c => 
        c.id === convId ? { ...c, unread: 0 } : c
      ));
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
    setMessages(prev => [...prev, optimisticMsg]);

    const res = await sendMessage({
      receiverId: activeConv.partner.id,
      content,
      conversationId: activeConv.id
    });

    if (!res.success) {
      toast.error("Failed to send message");
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } else {
      // Replace optimistic message with real one
      setMessages(prev => prev.map(m => m.id === tempId ? res.data as any : m));
      
      // Update conversations list
      setConversations(prev => {
        const otherConvs = prev.filter(c => c.id !== activeConv.id);
        const updatedActive = {
          ...activeConv,
          lastMessage: content,
          time: "Just now"
        };
        return [updatedActive, ...otherConvs];
      });
    }
    setSending(false);
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] flex overflow-hidden surface-card rounded-[2.5rem] border border-border/50 shadow-2xl">
      {/* Sidebar - Conversations List */}
      <div className={cn(
        "w-full md:w-80 lg:w-96 border-r border-border/50 flex flex-col bg-surface-card transition-all",
        mobileView === "chat" ? "hidden md:flex" : "flex"
      )}>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold text-foreground">Talks</h1>
            <Button 
              aria-label="New message"
              size="icon" 
              variant="ghost" 
              className="w-12 h-12 rounded-2xl bg-surface-sunken hover:bg-surface-elevated transition-all border border-border/50"
            >
              <Plus className="w-6 h-6 text-brand-orange" />
            </Button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary group-focus-within:text-brand-orange transition-colors" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-11 bg-surface-sunken border-border/50 focus:border-brand-orange/50 rounded-2xl h-12 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
          {conversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-sunken flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-txt-tertiary" />
              </div>
              <p className="text-xs font-bold text-txt-tertiary uppercase tracking-widest">No messages yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={cn(
                  "p-4 mb-2 flex items-center gap-4 cursor-pointer rounded-[1.5rem] transition-all group relative",
                  activeConv?.id === conv.id 
                    ? "bg-brand-orange/10 border border-brand-orange/20" 
                    : "hover:bg-surface-sunken border border-transparent"
                )}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-surface-elevated flex items-center justify-center font-bold text-brand-navy border border-border/50 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                    {conv.partner.avatar ? (
                      <img src={conv.partner.avatar} alt={conv.partner.name} className="w-full h-full object-cover" />
                    ) : (
                      conv.partner.name[0]
                    )}
                  </div>
                  {conv.partner.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-4 border-surface-card" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn(
                      "font-bold truncate transition-colors",
                      activeConv?.id === conv.id ? "text-brand-orange" : "text-foreground group-hover:text-brand-orange"
                    )}>
                      {conv.partner.name}
                    </h4>
                    <span className="text-[10px] font-bold text-txt-tertiary uppercase">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-txt-secondary truncate pr-4 font-medium">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="bg-brand-orange text-white text-[10px] font-black px-2 py-0.5 rounded-lg min-w-[1.25rem] text-center shadow-lg shadow-brand-orange/20">
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
      <div className={cn(
        "flex-1 flex flex-col bg-surface-sunken/10 transition-all",
        mobileView === "list" ? "hidden md:flex" : "flex"
      )}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-border/50 bg-surface-card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMobileView("list")}
                  className="md:hidden p-2 rounded-xl bg-surface-sunken text-txt-tertiary"
                  aria-label="Back to conversations"
                  title="Back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-surface-elevated overflow-hidden border border-border/50">
                   {activeConv.partner.avatar ? (
                      <img src={activeConv.partner.avatar} alt={activeConv.partner.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-brand-navy">
                        {activeConv.partner.name[0]}
                      </div>
                    )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-tight">{activeConv.partner.name}</h3>
                  <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">
                    {activeConv.partner.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl text-txt-tertiary hover:text-foreground" aria-label="Search messages" title="Search">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl text-txt-tertiary hover:text-foreground" aria-label="More options" title="Options">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages Content */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-sunken/50 to-transparent"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 rounded-3xl bg-surface-card border border-border/50 flex items-center justify-center mb-6 shadow-xl">
                      <MessageSquare className="w-10 h-10 text-brand-orange" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground">Say Hello!</h4>
                    <p className="text-sm text-txt-tertiary max-w-[240px] mt-2">Start your conversation with {activeConv.partner.name}.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex flex-col max-w-[80%]",
                        isMine ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-3xl text-sm font-medium shadow-lg",
                        isMine 
                          ? "bg-brand-orange text-white rounded-tr-none" 
                          : "bg-surface-card text-foreground border border-border/50 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 px-2">
                        <span className="text-[9px] font-bold text-txt-tertiary uppercase tracking-tighter">
                          {mounted ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                        </span>
                        {isMine && (
                          msg.readAt ? (
                            <CheckCheck className="w-3 h-3 text-brand-orange" />
                          ) : (
                            <Check className="w-3 h-3 text-txt-tertiary" />
                          )
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-surface-card border-t border-border/50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="w-12 h-12 rounded-2xl bg-surface-sunken text-txt-tertiary hover:text-brand-orange hover:bg-brand-orange/10 transition-all shrink-0"
                  aria-label="Attach file"
                  title="Attach"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="w-full bg-surface-sunken border-none rounded-[1.5rem] h-12 px-6 pr-12 focus:ring-2 ring-brand-orange/20 font-medium"
                  />
                  <button 
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-txt-tertiary hover:text-brand-orange transition-colors"
                    aria-label="Add emoji"
                    title="Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <Button 
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-12 h-12 rounded-2xl bg-brand-orange hover:bg-brand-orange-dark text-white shadow-lg shadow-brand-orange/20 shrink-0 group transition-all active:scale-95"
                >
                  <Send className={cn("w-5 h-5 transition-transform", sending ? "animate-pulse" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-sunken/50 to-transparent">
            <div className="w-24 h-24 rounded-[2rem] bg-surface-card border border-border/50 flex items-center justify-center mb-8 shadow-2xl shadow-brand-orange/5 animate-bounce-slow">
              <MessageSquare className="w-12 h-12 text-brand-orange" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Your <span className="text-brand-orange">Lounge</span></h2>
            <p className="text-sm text-txt-tertiary max-w-[320px] font-medium leading-relaxed">
              Connect with your personal trainer or gym support. Select a conversation to start the dialogue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
