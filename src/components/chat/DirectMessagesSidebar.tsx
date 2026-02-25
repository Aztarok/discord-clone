"use client";

import Link from "next/link";
import { BsPersonRaisedHand } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
const DirectMessagesSidebar = () => {
    const supabase = createClient();
    type Friend = {
        id: string;
        username: string;
    };
    type Friendship = {
        requester_id: string;
        addressee_id: string;
        status: string;
    };
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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
                .select("id, username")
                .in("id", friendIds);
            setFriends((profiles as Friend[]) ?? []);
            console.log(profiles);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getFriends();
    }, []);

    return (
        <div className="w-72 bg-zinc-950 flex flex-col border-r border-zinc-800">
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
            {loading && (
                <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            {friends.map((friend) => (
                <Link href={`/chat/${friend.id}`} key={friend.id}>
                    <div className="flex overflow-hidden object-contain items-center gap-1 px-2 py-1 cursor-pointer hover:bg-zinc-800 rounded-[5px] w-[90%] mx-auto">
                        <Avatar className="w-10 h-10 rounded-full">
                            {/* <AvatarImage src={friend.image} alt="youtube" /> */}
                            <AvatarFallback>{"YT"}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold p-2">{friend.username}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};
export default DirectMessagesSidebar;
