// app/(chat)/layout.tsx
"use client"; // ← important – we need hooks

import DirectMessagesSidebar from "@/components/chat/DirectMessagesSidebar";
import ServerSidebar from "@/components/chat/ServerSidebar";
import { useSelectedLayoutSegments } from "next/navigation";
// import FriendsPage from './friends/page';   // if you want to import directly

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const segments = useSelectedLayoutSegments();

    // segments examples:
    // []                     → root / (or /friends if you have friends/page.tsx)
    // ['abc123']             → /abc123  (server only)
    // ['abc123', 'general']  → /abc123/general
    const isInChannelView = segments.length >= 1; // at least serverId present

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Always show server sidebar */}
            <ServerSidebar />

            {/* Show channel sidebar only when in a server */}
            <DirectMessagesSidebar />

            {/* Main area – conditional content */}
            <>{children}</>

            {/* Optional members sidebar – only in channel view */}
            {isInChannelView && (
                // <MemberSidebar />
                <div className="w-60 bg-zinc-900 border-l border-zinc-800 p-4 text-zinc-400">
                    Members (coming soon)
                </div>
            )}
        </div>
    );
}
