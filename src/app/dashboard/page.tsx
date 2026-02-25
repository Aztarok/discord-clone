import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "../actions/auth";

export default async function Dashboard() {
    const supabase = await createServer();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
            <h1 className="text-3xl font-semibold">Welcome {session.user.email}</h1>
            <Button className="cursor-pointer" onClick={signOut}>
                Logout
            </Button>
        </div>
    );
}
