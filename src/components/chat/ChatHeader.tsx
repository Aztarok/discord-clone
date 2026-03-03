// components/chat/ChatHeader.tsx
"use client";

import { useParams } from "next/navigation";
import { Hash } from "lucide-react";

export default function ChatHeader({ serverId }: { serverId?: string }) {
    // In real app → fetch channel name from supabase or context
    const channelName = serverId; // placeholder — replace with real data

    if (!serverId) return null;

    return (
        <div className="bg-zinc-900 border-b border-zinc-800 flex items-center px-4 h-18">
            <Hash className="h-5 w-5 text-zinc-400 mr-2" />
            <h1 className="font-semibold">{channelName}</h1>
        </div>
    );
}
