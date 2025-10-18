import { Author } from "@/types"
import { UserAvatar } from "./UserAvatar"

export const AuthorProfile = (author: Author) => {
    return (
        <div className="flex items-center justify-center gap-2">
            <UserAvatar {...author} />
            <div className="flex flex-col items-start justify-center">
                <span className="text-sm font-semibold">{author.fullname}</span>
                <span className="text-neutral-400">{author.username}</span>
            </div>
        </div>
    );
};