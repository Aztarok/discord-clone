"use client";

import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SignUpPage() {
    const [formAction, setFormAction] = useActionState(signUp, null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!avatar) return;

        const form = e.currentTarget;
        const formData = new FormData(form);

        formData.set("avatar", avatar);
    };
    const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatar(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
            <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 shadow-2xl shadow-black/40">
                <h1 className="mb-2 text-3xl font-semibold text-white">Create Account</h1>
                <p className="mb-6 text-sm text-neutral-400">
                    Sign up with your email and password
                </p>

                <form action={setFormAction} className="space-y-4" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div>
                        <label className="mb-1 block text-sm text-neutral-300">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white outline-none transition focus:border-white"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm text-neutral-300">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white outline-none transition focus:border-white"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1 block text-sm text-neutral-300">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white outline-none transition focus:border-white"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    {/* Profile Picture */}
                    <div className="">
                        <div className="flex items-center gap-4">
                            <div className="cursor-pointer">
                                <label className="mb-1 block text-sm text-neutral-300">
                                    Profile Picture
                                </label>
                                <Input
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImagePreview}
                                    className="w-full border-0 p-0 hover:file:cursor-pointer text-sm text-neutral-300 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black hover:file:bg-neutral-200 "
                                />
                            </div>
                        </div>
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={imagePreview ?? ""} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-red-500 font-bold">
                        {formAction?.error && <p>{formAction.error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-white py-2 font-medium text-black transition hover:bg-neutral-200 cursor-pointer"
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
