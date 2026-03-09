// app/page.tsx
import { redirect } from "next/navigation";
import Image from "next/image";
import { createServer } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
    // Create Supabase server client (uses cookies automatically)
    // const supabase = await createServer();

    // Get the current user (safest/recommended way in Supabase + Next.js App Router)
    // const {
    //     data: { user },
    // } = await supabase.auth.getUser();

    // // If user is signed in → redirect to friends page immediately
    // if (user) {
    //     redirect("/chat"); // ← change to your actual friends/DMs route
    //     // or redirect('/chat') if that's where your chat/friends UI lives
    // }

    // Not signed in → show landing page
    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#1f1b2e] to-[#1a1c2a] font-sans dark:from-black dark:to-zinc-900">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-8 sm:items-start">
                {/* App Logo */}

                {/* Hero Text */}
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mt-8">
                    <h1 className="max-w-xs text-4xl font-extrabold leading-snug tracking-tight text-white dark:text-zinc-50">
                        Welcome to <span className="text-indigo-500">Chatterbox</span>
                    </h1>
                    <p className="max-w-md text-lg leading-8 text-zinc-300 dark:text-zinc-600">
                        Connect with friends, dive into conversations, and explore communities — all
                        in one place. Your chats, your way.
                    </p>
                </div>

                {/* Sign In Buttons */}
                <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-8">
                    <Link
                        href="/sign-in"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 text-white px-5 transition-colors hover:bg-indigo-700 md:w-45"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/sign-up"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-indigo-600 text-indigo-600 px-5 transition-colors hover:bg-indigo-50 md:w-45"
                    >
                        Create Account
                    </Link>
                </div>

                {/* Optional Footer */}
                <p className="mt-12 text-sm text-zinc-400 dark:text-zinc-600 sm:text-left text-center">
                    Chatterbox © 2026 — Built with ❤️ and Supabase
                </p>
            </main>
        </div>
    );
}
