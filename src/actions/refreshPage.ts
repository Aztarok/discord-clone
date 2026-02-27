import { revalidatePath } from "next/cache";

export async function refreshPage() {
    revalidatePath("/chat");
}
