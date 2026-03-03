// // components/chat/ChatInput.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ChatInput() {
    const { serverId } = useParams();
    const [content, setContent] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!content.trim() || !serverId) return;

        setSending(true);
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error, status } = await supabase.from("messages").insert({
            content: content.trim(),
            user_id: user.id,
            server_id: serverId as string,
            attachments: [],
        });
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

// interface ChatInputProps {
//     onSend: (content: string) => void;
// }

// const ChatInput = ({ onSend }: ChatInputProps) => {
//     const [value, setValue] = useState("");

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!value.trim()) return;

//         onSend(value);
//         setValue("");
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//                 className="w-full p-2"
//                 placeholder="Message..."
//             />
//         </form>
//     );
// };

// export default ChatInput;
