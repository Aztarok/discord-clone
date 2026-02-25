import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
            <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 shadow-2xl shadow-black/40">
                <h1 className="mb-2 text-3xl font-semibold text-white">Create Account</h1>
                <p className="mb-6 text-sm text-neutral-400">
                    Sign up with your email and password
                </p>

                <form action={signUp} className="space-y-4">
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

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-white py-2 font-medium text-black transition hover:bg-neutral-200"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-sm text-neutral-400">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-white hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
