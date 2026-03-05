import { User } from "@supabase/supabase-js";

export type CurrentUser = {
    auth: User;
    profile: {
        username: string;
        avatar_url: string | null;
    };
};
