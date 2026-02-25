"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
    const [tab, setTab] = useState(0);
    const [friend, setFriend] = useState("");
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loadingPending, setLoadingPending] = useState(false);
    const [friends, setFriends] = useState<any[]>([]);
    const [loadingFriends, setLoadingFriends] = useState(false);

    const router = useRouter();

    const getTabStyles = (index: number) =>
        `text-lg font-bold rounded-[5px] p-1 px-4 bg-transparent cursor-pointer transition-colors ${
            tab === index ? "bg-blue-800 text-white" : "hover:bg-blue-500/50 text-zinc-300"
        }`;

    useEffect(() => {
        if (tab === 2) {
            fetchPendingRequests();
        }
        if (tab === 0 || tab === 1) {
            fetchFriends();
        }
    }, [tab]);

    const handleAddFriend = async () => {
        if (!friend) return;
        console.log("Adding friend...");
        console.log(friend);
        const supabase = createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error("Not authenticated");
            return;
        }

        const { data: otherUser, error: userError } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", friend)
            .single();
        console.log(otherUser);

        if (userError || !otherUser) {
            console.error("User not found");
            return;
        }

        if (otherUser.id === user.id) {
            console.error("You can't add yourself as a friend");
            return;
        }

        const { error: insertError } = await supabase.from("friendships").insert({
            requester_id: user.id,
            addressee_id: otherUser.id,
            status: "pending",
        });

        if (insertError) {
            console.error(insertError.message);
            return;
        }
        setFriend("");
        console.log("Friend request sent!");
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/sign-in");
    };
    const handleTest = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", "Azleath")
            .single();
        console.log(data);
    };
    const fetchPendingRequests = async () => {
        const supabase = createClient();
        setLoadingPending(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setLoadingPending(false);
            return;
        }

        const { data, error } = await supabase
            .from("friendships")
            .select(
                `
      id,
      requester_id,
      profiles!friendships_requester_id_fkey ( username )
    `,
            )
            .eq("addressee_id", user.id)
            .eq("status", "pending");

        if (error) {
            console.error(error.message);
        } else {
            setPendingRequests(data || []);
        }

        setLoadingPending(false);
    };

    const handleAccept = async (requestId: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from("friendships")
            .update({ status: "accepted" })
            .eq("id", requestId);

        if (error) {
            console.error(error.message);
        }

        console.log("Friend request accepted!");
    };

    const fetchFriends = async () => {
        const supabase = createClient();
        setLoadingFriends(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setLoadingFriends(false);
            return;
        }

        const { data, error } = await supabase
            .from("friendships")
            .select(
                `
            id,
            requester_id,
            addressee_id,
            requester:profiles!friendships_requester_id_fkey (
                id,
                username,
                is_online
            ),
            addressee:profiles!friendships_addressee_id_fkey (
                id,
                username,
                is_online
            )
        `,
            )
            .eq("status", "accepted")
            .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

        if (error) {
            console.error(error.message);
        } else {
            const mappedFriends = data.map((f: any) => {
                return f.requester_id === user.id ? f.addressee : f.requester;
            });

            setFriends(mappedFriends);
        }

        setLoadingFriends(false);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
                <div className="flex-1 overflow-y-auto ">
                    {/* You can render children here too if using /friends/page.tsx */}
                    {/* Or hard-code/import your friends component: */}
                    <div className="flex mb-6 border-b pb-5 h-18 p-4 border-zinc-800 items-center">
                        <h2 className="text-lg font-bold">Friends / Direct Messages</h2>

                        <span className="flex gap-3 items-center ml-5">
                            <Button onClick={() => setTab(0)} className={getTabStyles(0)}>
                                Online
                            </Button>
                            <Button onClick={() => setTab(1)} className={getTabStyles(1)}>
                                All
                            </Button>
                            <Button onClick={() => setTab(2)} className={getTabStyles(2)}>
                                Pending
                            </Button>
                            <Button onClick={() => setTab(3)} className={getTabStyles(3)}>
                                Add Friend
                            </Button>
                            <Button onClick={() => handleLogout()} className={getTabStyles(4)}>
                                Logout
                            </Button>
                            <Button onClick={() => handleTest()} className={getTabStyles(4)}>
                                Test
                            </Button>
                        </span>
                    </div>

                    <div className="space-y-4 px-4">
                        {/* Placeholder – replace with real DM list, online friends, etc. */}
                        {tab === 0 && (
                            <div className="space-y-3">
                                {loadingFriends && <p className="text-zinc-400">Loading...</p>}

                                {!loadingFriends &&
                                    friends.filter((f) => f.is_online).length === 0 && (
                                        <p className="text-zinc-400">No friends online.</p>
                                    )}

                                {friends
                                    .filter((f) => f.is_online)
                                    .map((friend) => (
                                        <div
                                            key={friend.id}
                                            className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center"
                                        >
                                            <p>{friend.username}</p>
                                            <span className="text-green-400 text-sm">Online</span>
                                        </div>
                                    ))}
                            </div>
                        )}
                        {tab === 1 && (
                            <div className="space-y-3">
                                {loadingFriends && <p className="text-zinc-400">Loading...</p>}

                                {!loadingFriends && friends.length === 0 && (
                                    <p className="text-zinc-400">You have no friends yet.</p>
                                )}

                                {friends.map((friend) => (
                                    <div
                                        key={friend.id}
                                        className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center"
                                    >
                                        <p>{friend.username}</p>

                                        <span
                                            className={`text-sm ${
                                                friend.is_online
                                                    ? "text-green-400"
                                                    : "text-zinc-500"
                                            }`}
                                        >
                                            {friend.is_online ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {tab === 2 && (
                            <div className="space-y-3">
                                {loadingPending && <p className="text-zinc-400">Loading...</p>}

                                {!loadingPending && pendingRequests.length === 0 && (
                                    <p className="text-zinc-400">No pending friend requests yet.</p>
                                )}

                                {pendingRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="bg-zinc-900 p-4 rounded-lg flex justify-between items-center"
                                    >
                                        <p>{request.profiles.username}</p>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleAccept(request.id)}
                                                size="sm"
                                                className="bg-green-600"
                                            >
                                                Accept
                                            </Button>
                                            <Button size="sm" variant="destructive">
                                                Decline
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {tab === 3 && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddFriend();
                                }}
                                className="bg-zinc-900 p-4 rounded-lg relative"
                            >
                                <Input
                                    placeholder="Enter a username"
                                    value={friend}
                                    onChange={(e) => setFriend(e.target.value)}
                                    className="bg-zinc-800 text-white pr-32 h-12"
                                />
                                <Button
                                    className="absolute right-5 top-1/2 -translate-y-1/2 h-8 px-4 bg-emerald-600 hover:bg-emerald-700"
                                    type="submit"
                                >
                                    Add Friend
                                </Button>
                            </form>
                        )}
                        <div className="bg-zinc-900 p-4 rounded-lg">
                            <p className="text-zinc-400">No conversations yet. Start chatting!</p>
                        </div>

                        {/* ... more DM items */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
