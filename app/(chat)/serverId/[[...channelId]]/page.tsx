"use client";

import ChatInput from "@/components/chat/ChatInput";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChannelPage() {
    const params = useParams();
    const router = useRouter();
    const serverId = params.serverId as string;
    const channelSegments = params.channelId as string[] | undefined;

    useEffect(() => {
        if (!channelSegments || channelSegments.length === 0) {
            // No channel → redirect to default (e.g. "general" or first channel from supabase)
            router.replace(`/friends`);
            // Later: fetch first channel UUID from supabase and redirect there
        }
    }, [channelSegments, serverId, router]);

    // Optional loading state or fallback
    if (!channelSegments || channelSegments.length === 0) {
        return <div className="flex-1 flex items-center justify-center">Loading channel...</div>;
    }
    return <ChatInput />;

    // Normal chat – but since layout already renders ChatHeader/Area/Input,
    // you can actually return null or empty fragment here if you moved them to layout
    return null; // ← or <></>   (common pattern when layout handles UI)
}
