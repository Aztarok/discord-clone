"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { CurrentUser } from "@/services/supabase/types/User";
import { useRouter } from "next/navigation";

type Props = {
    user: CurrentUser;
    open: boolean;
    onClose: () => void;
};
type UserProfile = {
    id: string;
    email: string;
    username?: string;
};

export default function SettingsModal({ user, open, onClose }: Props) {
    const supabase = createClient();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<File | null>(null);

    const getUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // setUser({
        //     id: user.id,
        //     email: user.email ?? "",
        //     username: user.user_metadata.username ?? "",
        // });
        setUsername(user.user_metadata.username ?? "");
    };
    // useEffect(() => {
    //     getUser();
    // }, []);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatar(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    // const uploadAvatar = async () => {
    //     if (!avatar || !user) return null;

    //     // if (user.profile.avatar_url) {
    //     //     const path = user.profile.avatar_url.split("/avatars/")[1];
    //     //     console.log("path", path);
    //     //     const { data, error } = await supabase.storage.from("avatars").remove([path]);
    //     //     if (error) {
    //     //         console.error(error);
    //     //         console.log("error deleting", data);
    //     //         console.log("error deleting", error);
    //     //         return null;
    //     //     }
    //     //     console.log("deleted", data);
    //     // }

    //     const fileExt = avatar.name.split(".").pop();
    //     const filePath = `${user.auth.id}/avatar.${fileExt}`;

    //     const { error } = await supabase.storage
    //         .from("avatars")
    //         .upload(filePath, avatar, { upsert: true });

    //     if (error) {
    //         console.error(error);
    //         return null;
    //     }

    //     const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    //     console.log(data);
    //     return data.publicUrl;
    // };

    // const saveChanges = async () => {
    //     if (!user) return;
    //     let avatarUrl = user.profile.avatar_url;

    //     if (avatar) {
    //         const uploadedUrl = await uploadAvatar();

    //         if (uploadedUrl) {
    //             avatarUrl = uploadedUrl;
    //         }
    //         console.log("avatarUrl", avatarUrl);
    //     }

    //     const { error } = await supabase
    //         .from("profiles")
    //         .update({
    //             avatar_url: avatarUrl,
    //             username: username || user.profile.username,
    //         })
    //         .eq("id", user.auth.id);

    //     if (error) {
    //         console.error(error);
    //         return null;
    //     }
    //     onClose();
    // };

    const deleteOldAvatar = async () => {
        if (!user.profile.avatar_url) return;

        const path = user.profile.avatar_url.split("/avatars/")[1];

        const { error } = await supabase.storage.from("avatars").remove([path]);

        if (error) {
            console.error("Delete error:", error);
        }
    };

    const uploadAvatar = async () => {
        if (!avatar) return null;

        const fileExt = avatar.name.split(".").pop();
        const filePath = `${user.auth.id}/avatar.${fileExt}`;

        const { error } = await supabase.storage.from("avatars").upload(filePath, avatar, {
            upsert: true,
        });

        if (error) {
            console.error("Upload error:", error);
            return null;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

        return `${data.publicUrl}?t=${Date.now()}`;
    };

    const saveChanges = async () => {
        if (!user) return;

        let avatarUrl = user.profile.avatar_url;

        if (avatar) {
            await deleteOldAvatar();

            const newUrl = await uploadAvatar();
            if (newUrl) avatarUrl = newUrl;
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                avatar_url: avatarUrl,
                username: username || user.profile.username,
            })
            .eq("id", user.auth.id);

        if (error) {
            console.error("Update error:", error);
            return;
        }

        onClose();
        router.push("/");
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent
                className="min-w-2xl p-0 overflow-hidden bg-cyan-600 text-white border-zinc-800"
                aria-describedby="Profile Settings"
                aria-description="Profile Settings"
            >
                <Tabs defaultValue="profile" orientation="vertical" className="flex h-137.5">
                    {/* Sidebar */}
                    <div className="w-52 bg-zinc-300 border-r border-zinc-800 p-4">
                        <TabsList className="flex flex-col gap-1 bg-transparent p-0">
                            <TabsTrigger value="profile" className="justify-start cursor-pointer">
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="appearance"
                                className="justify-start cursor-pointer"
                            >
                                Appearance
                            </TabsTrigger>
                            <TabsTrigger value="account" className="justify-start cursor-pointer">
                                Account
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <TabsContent value="profile">
                            <DialogHeader>
                                <DialogTitle>Profile Settings</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6 mt-6">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage
                                            src={imagePreview ?? user.profile.avatar_url ?? ""}
                                        />
                                        <AvatarFallback>
                                            {user.profile.username[0] ?? ""}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="cursor-pointer">
                                        <label className="text-sm text-white">
                                            Change Profile Picture
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="mt-2 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="text-sm text-white">Username</label>
                                    <Input
                                        className="mt-2 text-white placeholder:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-transparent focus-visible:border-black focus-visible:border-2"
                                        value={username}
                                        placeholder={`${user.profile.username}`}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <Button onClick={saveChanges} className="w-full cursor-pointer">
                                    Save Changes
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="appearance">
                            <DialogHeader>
                                <DialogTitle>Appearance</DialogTitle>
                            </DialogHeader>

                            <div className="flex items-center justify-between mt-8">
                                <span>Dark Mode</span>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                    className="cursor-pointer"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="account">
                            <DialogHeader>
                                <DialogTitle>Account</DialogTitle>
                            </DialogHeader>

                            <div className="flex items-center justify-between mt-8">
                                <span>Enable Notifications</span>
                                <Switch
                                    className="cursor-pointer"
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>

                            <Button variant="destructive" className="mt-8 w-full cursor-pointer">
                                Log Out
                            </Button>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
