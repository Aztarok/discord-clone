"use client";

import { signIn } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function SignInPage() {
    const [state, formAction] = useActionState(signIn, null);
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
            <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 shadow-2xl shadow-black/40">
                <h1 className="mb-2 text-3xl font-semibold text-white">Welcome Back</h1>
                <p className="mb-6 text-sm text-neutral-400">Sign in to your account</p>

                <form action={formAction} className="space-y-4">
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
                        {state?.error && <p>{state.error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-white py-2 font-medium text-black transition hover:bg-neutral-200"
                    >
                        Sign In
                    </button>
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
