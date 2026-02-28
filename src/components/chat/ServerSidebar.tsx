// components/chat/ServerSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Server = {
    id: string;
    name: string;
    icon_url?: string | null;
};

export default function ServerSidebar() {
    const router = useRouter();
    const { serverId } = useParams();
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchServers = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("server_members")
                .select("server_id, servers!inner(id, name, icon_url, type)")
                .eq("user_id", user.id)
                .eq("servers.type", "server");
            console.log("servers", data);

            setServers(data?.map((m: any) => m.servers) || []);
            setLoading(false);
        };

        fetchServers();
    }, []);

    return (
        <TooltipProvider>
            <div className="flex flex-col items-center w-20 h-screen bg-zinc-950 py-3 space-y-4 border-r border-zinc-800">
                {/* Home / DMs icon - optional */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => router.push("/")}
                            className={cn(
                                "w-12 h-12 rounded-2xl bg-zinc-700 hover:bg-emerald-600 transition-all flex items-center justify-center",
                                !serverId && "bg-emerald-600",
                            )}
                        >
                            <User className="h-6 w-6" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Direct Messages</TooltipContent>
                </Tooltip>

                <div className="w-8 h-0.5 bg-zinc-700 rounded" />

                {loading ? (
                    <div
                        onClick={() => router.push("/chat/1")}
                        className="w-12 h-12 bg-zinc-800 rounded-full animate-pulse"
                    />
                ) : (
                    servers.map((server) => (
                        <Tooltip key={server.id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => router.push(`/${server.id}`)}
                                    className={cn(
                                        "relative w-12 h-12 rounded-2xl overflow-hidden transition-all hover:rounded-xl",
                                        serverId === server.id
                                            ? "rounded-xl bg-emerald-600"
                                            : "bg-zinc-700 hover:bg-zinc-600",
                                    )}
                                >
                                    {server.icon_url ? (
                                        <Avatar className="w-full h-full rounded-none">
                                            <AvatarImage src={server.icon_url} alt={server.name} />
                                            <AvatarFallback>{server.name[0]}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                                            {server.name[0].toUpperCase()}
                                        </div>
                                    )}
                                    {/* Active indicator pill */}
                                    {serverId === server.id && (
                                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-10 bg-white rounded-r-full" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{server.name}</TooltipContent>
                        </Tooltip>
                    ))
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-12 h-12 rounded-2xl bg-zinc-700 hover:bg-zinc-600 text-emerald-500 hover:cursor-pointer"
                            onClick={() => {
                                /* open create server dialog */
                            }}
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Create a Server</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
