// app/page.tsx
import { redirect } from "next/navigation";
import Image from "next/image";
import { createServer } from "@/lib/supabase/server";

export default async function Home() {
    // Create Supabase server client (uses cookies automatically)
    const supabase = await createServer();

    // Get the current user (safest/recommended way in Supabase + Next.js App Router)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If user is signed in → redirect to friends page immediately
    if (user) {
        redirect("/chat"); // ← change to your actual friends/DMs route
        // or redirect('/chat') if that's where your chat/friends UI lives
    }

    // Not signed in → show landing page
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={100}
                    height={20}
                    priority
                />
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                        Welcome to your chat app
                    </h1>
                    <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                        Sign in to access your friends, DMs and servers.
                    </p>
                </div>
                <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
                    {/* You can add a "Sign in" button here later */}
                    <a
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
                        href="/login" // ← point to your login page
                    >
                        Sign In
                    </a>
                    <a
                        className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
                        href="https://nextjs.org/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        asdf
                    </a>
                </div>
            </main>
        </div>
    );
}
