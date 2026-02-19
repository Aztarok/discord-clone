// components/chat/ChannelSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Hash, Volume2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Channel = {
    id: string;
    name: string;
    type: "text" | "voice";
};

export default function ChannelSidebar() {
    const { serverId, channelId } = useParams();
    const router = useRouter();
    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
        if (!serverId) return;

        const supabase = createClient();

        const fetchChannels = async () => {
            const { data } = await supabase
                .from("channels")
                .select("*")
                .eq("server_id", serverId)
                .order("created_at");

            setChannels(data || []);
        };

        fetchChannels();

        // Optional: realtime new channels
        const sub = supabase
            .channel(`channels:${serverId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "channels",
                    filter: `server_id=eq.${serverId}`,
                },
                (payload) => setChannels((prev) => [...prev, payload.new as Channel]),
            )
            .subscribe();

        return () => {
            supabase.removeChannel(sub);
        };
    }, [serverId]);

    if (!serverId) return null;

    return (
        <div className="w-60 bg-zinc-900 flex flex-col border-r border-zinc-800">
            {/* Server name header */}
            <div className="h-12 border-b border-zinc-800 flex items-center px-4 font-semibold">
                Server Name {/* ← fetch or pass as prop */}
            </div>

            <ScrollArea className="flex-1 px-2 py-4">
                <div className="space-y-2">
                    <div className="text-xs font-semibold text-zinc-400 px-2 uppercase tracking-wider mb-2">
                        Text Channels
                    </div>

                    {channels
                        .filter((c) => c.type === "text")
                        .map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => router.push(`/${serverId}/${channel.id}`)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-zinc-300 hover:bg-zinc-800 transition",
                                    channelId === channel.id && "bg-zinc-800 text-white",
                                )}
                            >
                                <Hash className="h-4 w-4" />
                                <span className="truncate">{channel.name}</span>
                            </button>
                        ))}

                    {/* Voice channels similarly... */}
                </div>
            </ScrollArea>

            <div className="p-2 border-t border-zinc-800">
                <Button variant="ghost" size="sm" className="w-full justify-start text-zinc-400">
                    <Plus className="h-4 w-4 mr-2" /> Create Channel
                </Button>
            </div>
        </div>
    );
}
