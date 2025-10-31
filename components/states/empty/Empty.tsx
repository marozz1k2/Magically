import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Newspaper, SearchX, UserRoundX } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

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
            <Button className="btn-login">{button}</Button>
          </Link>
        )}
      </EmptyContent>
    </Empty>
  );
};

export const ExploreEmpty = () => {
  return (
    <EmptyComponent
      title="No publications"
      description="Seems like there is no publications, be first, create one!"
      icon={Newspaper}
      button="Create"
      buttonLink="/create"
    />
  );
};

export const SearchUserEmpty = () => {
  return (
    <EmptyComponent
      title="User wasn't found"
      description="No users was found with this username, try another one."
      icon={UserRoundX}
    />
  );
};

export const SearchPublicationEmpty = () => {
  return (
    <EmptyComponent
      title="Publication wasn't found"
      description="No publication was found with this data, try another one."
      icon={SearchX}
    />
  );
};

export const PersonalProfileEmpty = () => {
  return (
    <EmptyComponent
      title="Nothing was found"
      description="No publication was found, try to create one."
      icon={BookOpen}
      button="Create publication"
      buttonLink="/create"
    />
  );
};

export const UserProfileEmpty = () => {
  return (
    <EmptyComponent
      title="No publications"
      description="Seems like this user has no any publications."
      icon={BookOpen}
    />
  );
};
