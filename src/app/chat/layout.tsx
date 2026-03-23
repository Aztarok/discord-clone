"use client"; // ← important – we need hooks

import DirectMessagesSidebar from "@/components/chat/DirectMessagesSidebar";
import ServerSidebar from "@/components/chat/ServerSidebar";
import SettingsModal from "@/components/settings/settingsModal";
import { createClient } from "@/lib/supabase/client";
import useCurrentUser from "@/services/supabase/actions/getCurrentUser";
import { CurrentUser } from "@/services/supabase/types/User";
import { User } from "@supabase/supabase-js";
import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useState } from "react";
// import FriendsPage from './friends/page';   // if you want to import directly

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const segments = useSelectedLayoutSegments();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const { user: authUser, loading } = useCurrentUser();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    const supabase = createClient();

    useEffect(() => {
        if (!authUser) return;
        const fetchEverything = async () => {
            // 1️⃣ Fetch profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", authUser.id)
                .single();

            if (!profile) return;

            setCurrentUser({
                auth: authUser,
                profile: {
                    username: profile.username ?? "",
                    avatar_url: profile.avatar_url ?? null,
                },
            });
        };
        fetchEverything();
    }, [authUser]);

    if (loading || !currentUser) {
        return (
            <div className="flex h-screen bg-zinc-950 text-white">
                <div className="w-20 bg-zinc-900">
                    <div className="h-16 border-b border-zinc-800"></div>
                </div>{" "}
                {/* server sidebar skeleton */}
                <div className="w-72 bg-zinc-950 border-r border-zinc-800">
                    <div className="h-16 border-b border-zinc-800"></div>
                </div>{" "}
                {/* DM sidebar */}
                <div className="w-8 h-8 absolute left-1/2 top-1/2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <div className="flex-1 flexr">
                    <div className="h-16 border-zinc-800 border-b w-full" />
                </div>
            </div>
        );
    }
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
            <DirectMessagesSidebar
                user={currentUser}
                onOpenSettings={() => setSettingsOpen(true)}
            />

            {/* Main area – conditional content */}
            <>{children}</>

            {/* Optional members sidebar – only in channel view */}
            {isInChannelView && (
                // <MemberSidebar />
                <div className="w-60 bg-zinc-900 border-l border-zinc-800 p-4 text-zinc-400">
                    Members (coming soon)
                </div>
            )}
            {settingsOpen && (
                <SettingsModal
                    user={currentUser}
                    open={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                />
            )}
        </div>
    );
}
