import { z } from "zod";

export const SignUpSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username too long"),

    email: z.string().email("Invalid email"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    avatar: z
        .instanceof(File)
        .refine((file) => file.size > 0, "Profile picture is required")
        .refine((file) => file.size < 5_000_000, "Image must be under 5MB")
        .refine(
            (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            "Only JPG, PNG, or WEBP images allowed",
        ),
});
