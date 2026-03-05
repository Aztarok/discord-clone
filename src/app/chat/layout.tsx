// app/(chat)/layout.tsx
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
            <div className="h-screen flex items-center justify-center text-white">Loading...</div>
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
