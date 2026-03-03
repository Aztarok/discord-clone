"use server";

import { createServer } from "@/lib/supabase/server";
import { Friend, Friendship } from "@/lib/types/Friends";

export const getFriends = async () => {
    const supabase = await createServer();
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
        return (profiles as Friend[]) ?? [];
    } catch (error) {
        console.error(error);
    }
};
