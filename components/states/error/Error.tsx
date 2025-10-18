import Link from "next/link";

import { TriangleAlert, UserLock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

export const NotAuthorized = () => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UserLock />
                </EmptyMedia>
                <EmptyTitle>Seems like you're not authorized</EmptyTitle>
                <EmptyDescription>You need to log in to see content</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Link href="/register">
                        <Button variant="outline">Register</Button>
                    </Link>
                    <Link href="/login">
                        <Button>Log In</Button>
                    </Link>
                </div>
            </EmptyContent>
        </Empty>
    );
};

export const ErrorComponent = ({
    title,
    description,
    icon: Icon,
    button,
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    button?: string;
}) => {
    return (
        <Empty className="max-w-96 bg-red-200/50 border-red-400 dark:bg-red-800/20 dark:border-red-800/50 border shadow-red-800/10 shadow-xl">
            <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-red-300 dark:bg-red-900/50">
                    <Icon className="text-red-800 dark:text-red-500" />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                {button && <Button>{button}</Button>}
            </EmptyContent>
        </Empty>
    );
};

export const ExploreError = () => {
    return <ErrorComponent title="Error loading content" description="Unknown error come later" icon={TriangleAlert} />
};