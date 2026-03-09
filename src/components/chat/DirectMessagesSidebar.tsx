"use client";

import { createClient } from "@/lib/supabase/client";
import { Friend, Friendship } from "@/lib/types/Friends";
import { CurrentUser } from "@/services/supabase/types/User";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsPersonRaisedHand } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
    user: CurrentUser | null;
    onOpenSettings: () => void;
};

const DirectMessagesSidebar = ({ user, onOpenSettings }: Props) => {
    const supabase = createClient();

    type DirectMessage = {
        serverId: string;
        otherUser: {
            id: string;
            username: string;
            avatar_url?: string | null;
        };
    };

    const [friends, setFriends] = useState<Friend[]>([]);
    const [dms, setDms] = useState<DirectMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const getDirectMessages = async () => {
        setLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data: memberships, error } = await supabase
                .from("server_members")
                .select(`server_id, servers!inner(id, type)`)
                .eq("user_id", user.id)
                .eq("servers.type", "dm");

            if (error || !memberships) {
                console.error(error);
                return null;
            }

            const serverIds = memberships
                .map((m) => m.server_id)
                .filter((id): id is string => id !== null);

            if (serverIds.length === 0) {
                setDms([]);
                return;
            }

            const { data: members } = await supabase
                .from("server_members")
                .select("server_id, user_id")
                .in("server_id", serverIds);

            if (!members) {
                setDms([]);
                return;
            }
            const otherUserIds = serverIds
                .map(
                    (serverId) =>
                        members.find((m) => m.server_id === serverId && m.user_id !== user.id)
                            ?.user_id,
                )
                .filter((id): id is string => !!id);
            const { data: profiles } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", otherUserIds as string[]);

            console.log("members", profiles);
            if (!profiles) return;

            const formatted: DirectMessage[] = serverIds.map((serverId) => {
                const otherMember = members.find(
                    (m) => m.server_id === serverId && m.user_id !== user.id,
                );

                const profile = profiles.find((p) => p.id === otherMember?.user_id);
                return {
                    serverId,
                    otherUser: {
                        id: profile?.id ?? "",
                        username: profile?.username ?? "Unknown",
                        avatar_url: profile?.avatar_url ?? null,
                    },
                };
            });

            setDms(formatted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const getFriends = async () => {
        setLoading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data: friendships, error } = await supabase
                .from("friendships")
                .select("*")
                .eq("status", "accepted")
                .or(`requester_id.eq.${user.id}, addressee_id.eq.${user.id}`);
            if (error || !friendships) {
                console.error(error);
                return null;
            }

            const typedFriendships = friendships as Friendship[];

            const friendIds = typedFriendships.map((f) =>
                f.requester_id === user.id ? f.addressee_id : f.requester_id,
            );

            const { data: profiles } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", friendIds);
            setFriends((profiles as Friend[]) ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getDirectMessages();
    }, []);

    return (
        <div className="w-72 bg-zinc-950 flex flex-col border-r border-zinc-800 h-full">
            <div className="flex flex-col gap-4 h-18 border-b border-zinc-800 justify-center">
                <Link href={"/chat"}>
                    <span className="flex flex-row bg-zinc-800 justify-center items-center hover:cursor-pointer hover:bg-zinc-900 rounded-[5px] w-[90%] mx-auto">
                        <BsPersonRaisedHand className="w-6 h-6" />
                        <p className="font-semibold p-2">Friends</p>
                    </span>
                </Link>
            </div>
            <div className="flex justify-between w-[90%] p-2 mx-auto items-center">
                <p className="text-gray-500 font-medium text-[14px]">Direct Messages</p>
                <p className="text-gray-500 font-bold text-[18px]">+</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {dms.map((dm) => (
                    <Link href={`/chat/${dm.serverId}`} key={dm.serverId}>
                        <div className="flex overflow-hidden object-contain items-center gap-1 px-2 py-1 cursor-pointer hover:bg-zinc-800 rounded-[5px] w-[90%] mx-auto">
                            <Avatar className="w-10 h-10 rounded-full">
                                <AvatarImage src={dm.otherUser.avatar_url ?? ""} alt="youtube" />
                                <AvatarFallback>
                                    {user?.auth?.email?.[0].toUpperCase() ?? ""}
                                </AvatarFallback>
                            </Avatar>
                            <p className="font-semibold p-2">{dm.otherUser.username}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="h-18 border-t border-zinc-800 flex items-center justify-between px-3 bg-zinc-900">
                <div className="flex items-center gap-2">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={user?.profile.avatar_url!} alt="profile image" />
                        <AvatarFallback>{user?.profile?.username ?? "A"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">{user?.profile.username}</span>
                        <span className="text-xs text-green-400">Online</span>
                    </div>
                </div>

                <button
                    onClick={onOpenSettings}
                    className="text-zinc-400 hover:text-white transition cursor-pointer size-8"
                >
                    ⚙
                </button>
            </div>
        </div>
    );
};
export default DirectMessagesSidebar;
