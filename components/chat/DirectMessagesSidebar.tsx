"use client";

import Link from "next/link";
import { BsPersonRaisedHand } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const DirectMessagesSidebar = () => {
    const friends = [
        {
            name: "Youtube",
            image: "https://static.bigbrain.gg/assets/lol/riot_static/16.3.1/img/small-perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png",
        },
    ];
    return (
        <div className="w-72 bg-zinc-950 flex flex-col border-r border-zinc-800">
            <div className="flex flex-col mt-5 gap-4">
                <Link href={"/chat"}>
                    <span className="flex flex-row bg-zinc-800 justify-center items-center hover:cursor-pointer hover:bg-zinc-900 rounded-[5px] w-[90%] mx-auto">
                        <BsPersonRaisedHand className="w-6 h-6" />
                        <p className="font-semibold p-2">Friends</p>
                    </span>
                </Link>
            </div>
            <div className="w-70 mx-auto h-px mt-4 bg-zinc-700 rounded" />
            <div className="flex justify-between w-[90%] p-2 mx-auto items-center">
                <p className="text-gray-500 font-medium text-[14px]">Direct Messages</p>
                <p className="text-gray-500 font-bold text-[18px]">+</p>
            </div>
            {friends.map((friend) => (
                <Link href={`/chat/${friend.name}`} key={friend.name}>
                    <div
                        key={friend.name}
                        className="flex overflow-hidden mt-4 object-contain cursor-pointer hover:bg-zinc-800 rounded-[5px] w-[90%] mx-auto"
                    >
                        <Avatar className="w-12.5 h-12.5 rounded-full">
                            <AvatarImage src={friend.image} alt="youtube" />
                            <AvatarFallback>{"YT"}</AvatarFallback>
                        </Avatar>
                    </div>
                </Link>
            ))}
        </div>
    );
};
export default DirectMessagesSidebar;
