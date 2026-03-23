"use client";

import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function SignInPage() {
    const router = useRouter();
    const [formState, setformState] = useActionState(signIn, null);
    const supabase = createClient();
    const { pending } = useFormStatus();
    useEffect(() => {
        const handleLogin = async () => {
            if (formState?.success) {
                // 🔑 wait until session is actually ready
                await new Promise((r) => setTimeout(r, 50));
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session) {
                    router.replace("/chat"); // 👈 use replace (important)
                }
            }
        };

        handleLogin();
    }, [formState, router, supabase]);
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
            <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 shadow-2xl shadow-black/40">
                <h1 className="mb-2 text-3xl font-semibold text-white">Welcome Back</h1>
                <p className="mb-6 text-sm text-neutral-400">Sign in to your account</p>

                <form action={setformState} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-neutral-300">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white outline-none transition focus:border-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-neutral-300">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white outline-none transition focus:border-white"
                        />
                    </div>

                    <div className="text-red-500 font-bold">
                        {formState?.error && <p>{formState.error}</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={pending}
                        className="w-full rounded-lg bg-white py-2 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                    >
                        {pending ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <p className="mt-6 text-sm text-neutral-400">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="text-white hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-white py-2 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
            {pending ? "Signing in..." : "Sign In"}
        </button>
    );
}
