// components/chat/ChatInput.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ChatInput() {
    const { serverId } = useParams();
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);
    console.log(serverId);

    const handleSend = async () => {
        if (!content.trim() || !serverId) return;
        console.log("hi");

        setSending(true);
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error, status } = await supabase.from("messages").insert({
            user: user.id,
            channelId: "Youtube",
            channel_id: serverId,
            content: content.trim(),
        });
        console.log(serverId);
        console.log(data, error, status);
        if (error) {
            console.error(error);
            setSending(false);
            return;
        }

        setContent("");
        setSending(false);
    };

    return (
        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                className="flex items-center gap-2"
            >
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Message..."
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-emerald-600"
                    disabled={sending}
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={sending || !content.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
}
