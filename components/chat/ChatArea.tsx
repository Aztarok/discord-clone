// components/chat/ChatArea.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";

type Message = {
    id: string;
    content: string;
    created_at: string;
    profiles: { username: string; avatar_url?: string | null };
};

export default function ChatArea() {
    const { channelId } = useParams<{ channelId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!channelId) return;

        const supabase = createClient();

        const loadMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select(
                    `
          id, content, created_at,
          profiles (username, avatar_url)
        `,
                )
                .eq("channel_id", channelId)
                .order("created_at", { ascending: true });

            setMessages((data as any[]) || []);
            scrollToBottom();
        };

        loadMessages();

        const subscription = supabase
            .channel(`chat:${channelId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `channel_id=eq.${channelId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                    scrollToBottom();
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [channelId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 50);
    };

    return (
        <ScrollArea className="flex-1 p-4 bg-zinc-950">
            <div ref={scrollRef} className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0" />
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold">
                                    {msg.profiles?.username ?? "User"}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <p className="text-zinc-300">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
