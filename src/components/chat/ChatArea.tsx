// components/chat/ChatArea.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Message = {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        username: string;
        avatar_url?: string | null;
    };
};

export default function ChatArea() {
    const { serverId } = useParams<{ serverId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // const fetchMessages = async () => {
    //     const { data, error } = await supabase
    //         .from("messages")
    //         .select(
    //             `
    //       id,
    //       content,
    //       created_at,
    //       user_id,
    //       profiles!inner (
    //         username
    //       )
    //     `,
    //         )
    //         .eq("server_id", serverId)
    //         .order("created_at", { ascending: true });

    //     if (error) {
    //         console.error("Failed to load messages:", error);
    //         return;
    //     }

    //     setMessages(data as Message[]);
    // };

    // useEffect(() => {
    //     if (!serverId) return;
    //     fetchMessages();
    // }, [serverId, supabase]);

    // useEffect(() => {
    //     const channel = supabase
    //         .channel(`chat:${serverId}`)
    //         .on(
    //             "postgres_changes",
    //             {
    //                 event: "INSERT",
    //                 schema: "public",
    //                 table: "messages",
    //                 filter: `server_id=eq.${serverId}`,
    //             },
    //             async (payload) => {
    //                 const { data: profile } = await supabase
    //                     .from("profiles")
    //                     .select("username")
    //                     .eq("id", payload.new.user_id)
    //                     .single();

    //                 const newMessage = {
    //                     ...payload.new,
    //                     profiles: {
    //                         username: profile?.username ?? "Unknown",
    //                         avatar_url: payload.new.avatar_url ?? null,
    //                     },
    //                 } as Message;

    //                 setMessages((messages) => [...messages, newMessage]);
    //                 scrollToBottom();
    //             },
    //         )
    //         .subscribe((status) => {
    //             console.log(`Channel status: ${status}`);
    //         });
    //     return () => {
    //         channel.unsubscribe();
    //     };
    // }, [serverId, supabase]);

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select(
                `
                id,
                content,
                created_at,
                user_id,
                profiles!inner (
                    username,
                    avatar_url
                )
            `,
            )
            .eq("server_id", serverId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Failed to load messages:", error);
            return;
        }

        setMessages(data as Message[]);
    };

    useEffect(() => {
        if (!serverId) return;
        fetchMessages();
    }, [serverId]);

    useEffect(() => {
        // Scroll to bottom whenever messages change
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!serverId) return;

        const channel = supabase
            .channel(`chat:${serverId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `server_id=eq.${serverId}`,
                },
                async (payload) => {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("username, avatar_url")
                        .eq("id", payload.new.user_id)
                        .single();

                    const newMessage = {
                        ...payload.new,
                        profiles: {
                            username: profile?.username ?? "Unknown",
                            avatar_url: profile?.avatar_url ?? null,
                        },
                    } as Message;

                    setMessages((prev) => [...prev, newMessage]);
                },
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [serverId, supabase]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }, 50);
    };

    return (
        <ScrollArea className="flex-1 p-4 bg-zinc-950 overflow-scroll no-scrollbar">
            <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                        {/* <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0" /> */}
                        <Avatar>
                            <AvatarImage
                                src={msg.profiles?.avatar_url ?? ""}
                                alt={msg.profiles?.username ?? "User"}
                            />
                            <AvatarFallback>
                                {msg.profiles?.username?.charAt(0) ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold">
                                    {msg.profiles?.username ?? "User"}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <p className="text-zinc-300">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>
        </ScrollArea>
    );
}

function formatMessageDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// const loadMessages = async () => {
//     const {
//         data: { user },
//     } = await supabase.auth.getUser();
//     console.log(user?.id);
//     if (!serverId) return;
//     const { data, error } = await supabase
//         .from("messages")
//         .select(
//             `
//                 id,
//                 content,
//                 created_at,
//                 profiles (username)
//                 `,
//         )
//         .eq("server_id", serverId)
//         .order("created_at", { ascending: true });
//     if (!error && data) {
//         setMessages((data as Message[]) || []);
//         scrollToBottom();
//     } else {
//         console.error(error);
//     }
// };
// useEffect(() => {
//     loadMessages();

// const subscription = supabase
//     .channel(`chat:${serverId}`)
//     .on(
//         "postgres_changes",
//         {
//             event: "INSERT",
//             schema: "public",
//             table: "messages",
//             filter: `channel_id=eq.${serverId}`,
//         },
//         (payload) => {
//             setMessages((prev) => [...prev, payload.new as Message]);
//             scrollToBottom();
//         },
//     )
//     .subscribe();

//     const channel = supabase
//         .channel(`chat:${serverId}`)
//         .on(
//             "postgres_changes",
//             {
//                 event: "INSERT",
//                 schema: "public",
//                 table: "messages",
//                 filter: `server_id=eq.${serverId}`,
//             },
//             async (payload) => {
//                 const { data } = await supabase
//                     .from("profiles")
//                     .select("username")
//                     .eq("id", payload.new.user_id)
//                     .single();
//                 const newMessage = {
//                     ...payload.new,
//                     profiles: data,
//                 } as Message;
//                 setMessages((prev) => [...prev, newMessage]);
//                 scrollToBottom();
//             },
//         )
//         .subscribe((status) => {
//             console.log("Realtime: ", status);
//         });

//     return () => {
//         supabase.removeChannel(channel);
//     };
// }, [serverId]);

// "use client";

// import { useEffect, useRef } from "react";

// import { createClient } from "@/lib/supabase/client";
// import { Tables } from "@/services/supabase/types/database.types";

// type Message = Tables<"messages">;

// interface ChatAreaProps {
//     messages: Message[];
// }

// const ChatArea = ({ messages }: ChatAreaProps) => {
//     const bottomRef = useRef<HTMLDivElement | null>(null);
//     const supabase = createClient();

//     const scrollToBottom = () => {
//         bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     return (
//         <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
//             {messages.map((message) => (
//                 <MessageBubble key={message.id} message={message} />
//             ))}
//             <div ref={bottomRef} />
//         </div>
//     );
// };

// export default ChatArea;

// interface MessageBubbleProps {
//     message: Message;
// }

// const MessageBubble = ({ message }: MessageBubbleProps) => {
//     const supabase = createClient();
//     const user = supabase.auth.getUser(); // lightweight for UI comparison

//     const isOwnMessage =
//         typeof window !== "undefined" &&
//         message.user_id === (supabase.auth.getUser() as any)?._cachedUser?.id;

//     return (
//         <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
//             <div
//                 className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow ${
//                     isOwnMessage
//                         ? "bg-indigo-600 text-white rounded-br-md"
//                         : "bg-gray-200 text-gray-900 rounded-bl-md"
//                 }`}
//             >
//                 <div>{message.content}</div>

//                 {message.created_at && (
//                     <div
//                         className={`text-[10px] mt-1 opacity-70 ${
//                             isOwnMessage ? "text-indigo-200" : "text-gray-500"
//                         }`}
//                     >
//                         {new Date(message.created_at).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
