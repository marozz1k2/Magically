import { API_URL } from '@/lib/api';
import { UserAttributes } from '@/types';
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from '@radix-ui/react-avatar';

export const UserAvatar = (user: {
    username: string;
    avatar?: string;
    fullname: string;
}) => {
    return (
        <Avatar className="flex items-center justify-center theme-2 size-10 rounded-full">
            <AvatarImage src={user.avatar !== null ? API_URL + user.avatar : ''} alt={user.username} />
            <AvatarFallback className="rounded-full text-black dark:text-white">{user.avatar === null ? user.fullname!.charAt(0) : ""}</AvatarFallback>
        </Avatar>
    );
};