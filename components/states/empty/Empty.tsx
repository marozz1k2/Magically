import Link from "next/link";

import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

export const EmptyComponent = ({
    title,
    description,
    icon: Icon,
    button,
    buttonLink,
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    button?: string;
    buttonLink?: string;
}) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Icon />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                {button && (
                    <Link href={buttonLink!}>
                        <Button>
                            {button}
                        </Button>
                    </Link>
                )}
            </EmptyContent>
        </Empty>
    );
};

export const ExploreEmpty = () => {
    return <EmptyComponent
        title="No publications"
        description="Seems like there is no publications, be first, create one!"
        icon={Newspaper}
        button="Create"
        buttonLink="/create"
    />
};