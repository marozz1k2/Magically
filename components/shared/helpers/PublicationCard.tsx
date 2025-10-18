"use client"

import Link from "next/link";
import Image from "next/image";

import { API_URL } from "@/lib/api";
import { ru, enUS } from "date-fns/locale";
import { Publication } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { AuthorProfile } from "./AuthorProfile";
import { Heart, MessageCircle } from "lucide-react";
import { useLikePublication, useUnlikePublication } from "@/hooks/usePublications";

export const PublicationCard = ({ pub }: { pub: Publication }) => {
  const likePublication = useLikePublication();
  const unLikePublication = useUnlikePublication();
  const locale = localStorage.getItem("locale") || "en";

  const formattedDate = formatDistanceToNow(pub.createdAt, {
    addSuffix: true,
    locale: locale === "ru" ? ru : enUS,
  });

  const handleLike = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (likePublication?.mutate) {
      likePublication.mutate(pub.id);
      return;
    }

    if (likePublication?.mutateAsync) {
      likePublication.mutateAsync(pub.id).catch(() => { });
      return;
    }
  };

  const handleUnlike = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (unLikePublication?.mutate) {
      unLikePublication.mutate(pub.id);
      return;
    }

    if (unLikePublication?.mutateAsync) {
      unLikePublication.mutateAsync(pub.id).catch(() => { });
      return;
    }
  }

  // A simple component to render either video or image
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <div className="flex md:hidden">
        <AuthorProfile {...pub.author} />
      </div>
      <Link href={`/publications/${pub.id}`} key={pub.id} className="relative w-full group">
        {pub.videoUrl ? (
          <video
            src={`${API_URL}${pub.videoUrl}`}
            autoPlay
            loop
            muted
            playsInline
            className="rounded-xl object-cover aspect-square w-full"
          />
        ) : (
          <Image
            src={`${API_URL}${pub.imageUrl}`}
            width={500}
            height={500}
            alt="publication"
            className="rounded-xl object-cover aspect-square w-full"
          />
        )}
        <div className="absolute hidden md:flex bottom-0 left-0 right-0 bg-white/20 dark:bg-black/20 
                    text-white p-4 text-xs rounded-b-lg rounded-t-3xl opacity-0 backdrop-blur-3xl 
                      group-hover:opacity-100 magic-transition"
        >
          <div className="flex flex-col items-start justify-center gap-4 px-4">
            <AuthorProfile {...pub.author} />
            <div className="flex items-center justify-start gap-4 mt-2">
              <button
                className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1"
                onClick={pub.isLiked ? handleUnlike : handleLike}
              >
                <Heart className={`size-5 ${pub.isLiked ? "text-red-500 fill-red-500" : ""} dark:${pub.isLiked ? "text-red-400 fill-red-400" : ""} stroke-1`} />
                <span>{pub.likeCount}</span>
              </button>
              <button className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1">
                <MessageCircle className="size-5 hover:text-white hover:fill-white stroke-1" />
                <span>{pub.commentCount}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex md:hidden flex-col items-start justify-center gap-2 px-4">
        <div className="flex items-center justify-start gap-4">
          <button
            className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1"
            onClick={pub.isLiked ? handleUnlike : handleLike}
          >
            <Heart className={`size-5 ${pub.isLiked ? "text-red-500 fill-red-500" : ""} dark:${pub.isLiked ? "text-red-400 fill-red-400" : ""} stroke-1`} />
            <span>{pub.likeCount}</span>
          </button>
          <button className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1">
            <MessageCircle className="size-5 hover:text-white hover:fill-white stroke-1" />
            <span>{pub.commentCount}</span>
          </button>
        </div>
        <div className="my-1">{pub.content}</div>
        <div className="text-sm secondary-text mb-4">
          {formattedDate}
        </div>
      </div>
    </div>
  );
};
