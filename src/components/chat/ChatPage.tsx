"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ChatPage = () => {
    const router = useRouter();

    const [tab, setTab] = useState(0);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        if (tab === 2) fetchPendingRequests();
        if (tab === 0 || tab === 1) fetchFriends();
    }, [tab]);

    const fetchFriends = async () => {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from("friendships")
            .select(
                `
                requester_id,
                addressee_id,
                requester:profiles!friendships_requester_id_fkey(id, username, is_online),
                addressee:profiles!friendships_addressee_id_fkey(id, username, is_online)
            `,
            )
            .eq("status", "accepted")
            .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

        if (data) {
            const mapped = data.map((f: any) =>
                f.requester_id === user.id ? f.addressee : f.requester,
            );
            setFriends(mapped);
        }

        setLoading(false);
    };

    const fetchPendingRequests = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from("friendships")
            .select(
                `
                id,
                profiles!friendships_requester_id_fkey(username)
            `,
            )
            .eq("addressee_id", user.id)
            .eq("status", "pending");

        setPendingRequests(data || []);
    };

    const acceptFriend = async (friendshipId: string) => {
        await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);

        await supabase.rpc("accept_friend_and_create_server", {
            friendship_id: friendshipId,
        });

        router.refresh(); // 🔥 THIS refreshes sidebar correctly
    };

    return (
        <div className="flex-1 p-6 text-white">
            <div className="flex gap-3 mb-6">
                <Button onClick={() => setTab(0)}>Online</Button>
                <Button onClick={() => setTab(1)}>All</Button>
                <Button onClick={() => setTab(2)}>Pending</Button>
            </div>

            {tab === 2 &&
                pendingRequests.map((req) => (
                    <div key={req.id} className="bg-zinc-900 p-4 rounded-lg flex justify-between">
                        <p>{req.profiles.username}</p>
                        <Button onClick={() => acceptFriend(req.id)} className="bg-green-600">
                            Accept
                        </Button>
                    </div>
                ))}

            {(tab === 0 || tab === 1) &&
                friends.map((friend) => (
                    <div
                        key={friend.id}
                        className="bg-zinc-900 p-4 rounded-lg flex justify-between"
                    >
                        <p>{friend.username}</p>
                        <span className={friend.is_online ? "text-green-400" : "text-zinc-500"}>
                            {friend.is_online ? "Online" : "Offline"}
                        </span>
                    </div>
                ))}
        </div>
    );
};

export default ChatPage;
