export type Friend = {
    id: string;
    username: string;
    avatar_url?: string | null;
};
export type Friendship = {
    requester_id: string;
    addressee_id: string;
    status: string;
};
