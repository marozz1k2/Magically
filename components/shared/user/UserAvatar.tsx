import { API_URL } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = (user: { username: string; avatar?: string; fullname: string }) => {
  return (
    <Avatar className="flex items-center flex-wrap justify-center theme-2 size-10 rounded-full">
      <AvatarImage
        src={user.avatar !== null ? API_URL! + user.avatar : ""}
        alt={user.username}
        className="rounded-full h-full w-full object-cover"
      />
      <AvatarFallback className="rounded-full text-black dark:text-white">
        {user.avatar === null ? user.fullname!.charAt(0) : ""}
      </AvatarFallback>
    </Avatar>
  );
};