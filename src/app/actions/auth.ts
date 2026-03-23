"use server";

import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { SignUpSchema } from "@/lib/validation/auth";
import { success } from "zod";

export async function signUp(prevState: { error?: string } | null, formData: FormData) {
    const supabase = await createServer();
    const data = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        avatar: formData.get("avatar") as File,
    };

    const result = SignUpSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { username, email, password, avatar } = result.data;

    const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

    if (existing) {
        return { error: "Username already taken" };
    }

    const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    const user = signUpData.user;

    if (!user) {
        return { error: "User not found" };
    }

    const fileExt = avatar.name.split(".").pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatar);

    if (uploadError) {
        console.log("Upload error:", uploadError);
        return { error: uploadError.message };
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const avatar_url = urlData.publicUrl;

    const { error: profileError } = await supabase
        .from("profiles")
        .update({
            username,
            avatar_url,
        })
        .eq("id", user.id);

    if (profileError) {
        return { error: profileError.message };
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

    return { success: true };
}

export async function signOut(): Promise<void> {
    const supabase = await createServer();

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    redirect("/sign-in");
}
