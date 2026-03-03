"use client";
import ChatArea from "@/components/chat/ChatArea";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { useParams } from "next/navigation";

const page = () => {
    const { serverId } = useParams();

    return (
        <div className="bg-blue-500 flex flex-col min-w-0 flex-1">
            <ChatHeader serverId={serverId as string} />
            <ChatArea />
            <ChatInput />
        </div>
    );
};

export default page;
