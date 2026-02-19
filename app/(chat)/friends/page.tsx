// app/(chat)/friends/page.tsx
export default function FriendsPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <h2 className="text-2xl font-semibold mb-4">Welcome to your DMs</h2>
            <p>Select a friend or start a new conversation</p>
            {/* Add friend list, requests, etc. later */}
        </div>
    );
}
