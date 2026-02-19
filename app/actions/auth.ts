"use server";

import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
    const supabase = await createServer();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/");
}

export async function signIn(prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createServer();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard");
}

export async function signOut(): Promise<void> {
    const supabase = await createServer();

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    redirect("/sign-in");
}
