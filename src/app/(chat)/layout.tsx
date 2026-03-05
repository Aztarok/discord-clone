// app/(chat)/layout.tsx
"use client"; // ← important – we need hooks

import ChannelSidebar from "@/components/chat/ChannelSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
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
            {isInChannelView && <ChannelSidebar />}

            {/* Main area – conditional content */}
            <div className="flex-1 flex flex-col min-w-0">
                {isInChannelView ? (
                    <>
                        <ChatHeader />
                        {children}{" "}
                        {/* ← this is ChatArea + ChatInput from [serverId]/[[...channelId]]/page.tsx */}
                    </>
                ) : (
                    // No server/channel selected → show friends/DMs page
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* You can render children here too if using /friends/page.tsx */}
                        {/* Or hard-code/import your friends component: */}
                        <h2 className="text-2xl font-bold mb-6">Friends / Direct Messages</h2>
                        <div className="space-y-4">
                            {/* Placeholder – replace with real DM list, online friends, etc. */}
                            <div className="bg-zinc-900 p-4 rounded-lg">
                                <p className="text-zinc-400">
                                    No conversations yet. Start chatting!
                                </p>
                            </div>
                            {/* ... more DM items */}
                        </div>
                    </div>
                )}
            </div>

            {/* Optional members sidebar – only in channel view */}
            {isInChannelView && (
                // <MemberSidebar />
                <div className="w-60 bg-zinc-900 border-l border-zinc-800 p-4 text-zinc-400">
                    Members
                </div>
            )}
        </div>
    );
}
