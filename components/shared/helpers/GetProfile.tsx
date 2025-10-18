"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bolt, Edit } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyProfile } from "@/components/states/empty/Empty";
import { ProfileError } from "@/components/states/errors/Errors";
import { ProfileLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import GradientText from "@/components/ui/magic/GradientText";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/hooks/useProfile";
import { EditProfileDialog } from "../functional/EditProfileDialog";

export const GetProfile = ({ username }: { username: string }) => {
  const t = useTranslations("Profile");
  const { data: user, isLoading, isError } = useProfile(username);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  if (isLoading) {
    return <ProfileLoader />;
  }

  if (isError) {
    return <ProfileError />;
  }

  return (
    <section className="section-flex container mx-auto max-w-6xl border-t border-l border-r h-full rounded-t-2xl">
      <div className="flex-between my-6 px-4 sm:px-6 lg:px-6">
        <h1 className="title-text">{t("Title")}</h1>
        <div className="flex items-center justify-center gap-1">
          <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="size-6" />
              </Button>
            </DialogTrigger>
            <EditProfileDialog user={user} setOpen={setEditProfileOpen} />
          </Dialog>
          <Link href="/settings" className="ease hover:bg-muted p-2 rounded-md">
            <Bolt />
          </Link>
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex-column gap-4 px-4 sm:px-6 lg:px-6">
        <div className="flex-between">
          <div className="flex flex-col gap-1 sm:gap-2 w-full">
            <h1 className="text-lg sm:text-xl font-bold">{user.fullname}</h1>
            <h2 className="text-sm sm:text-base text-muted-foreground">@{user.username}</h2>
          </div>
          <div className={`${user.avatar === null ? "p-2 empty rounded-full" : ""}`}>
            <Image
              src={
                user.avatar !== null
                  ? process.env.NEXT_PUBLIC_BACKEND_API + user.avatar
                  : "/assets/avatar-placeholder.svg"
              }
              width={48}
              height={48}
              alt={user.username}
              className={`rounded-full ${user.avatar === null ? "dark:invert" : ""}`}
            />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground break-words">{user.bio}</p>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex-around">
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Publications")}</h3>
          <p className="text-muted-foreground">{user.publicationsCount}</p>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Followers")}</h3>
          <p className="text-muted-foreground">{user.followersCount}</p>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-sm">{t("UserInfo.Following")}</h3>
          <p className="text-muted-foreground">{user.followingCount}</p>
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      {user.publications.length === 0 && (
        <div className="px-2 h-screen">
          <EmptyProfile />
        </div>
      )}
      <div className="grid-default gap-4 px-4">
        {user.publications.map((pub: any) => (
          <Link href={`/publications/${pub.id}`} key={pub.id} className="w-full">
            {pub.imageUrl && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_API}${pub.imageUrl}`}
                width={300}
                height={300}
                alt="pub"
                className="rounded-lg object-cover aspect-square"
              />
            )}
            {pub.videoUrl && (
              <video
                src={`${process.env.NEXT_PUBLIC_BACKEND_API}${pub.videoUrl}`}
                className="rounded-lg object-cover aspect-square"
              />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};
