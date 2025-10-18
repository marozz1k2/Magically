"use client";

import Image from "next/image";
import { useUser } from "@/hooks/useAuth";
import { ru, enUS } from "date-fns/locale";
import {
    usePublication,
    useLikePublication,
    useUnlikePublication,
} from "@/hooks/usePublications";

import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { ExploreError, NotAuthorized } from "@/components/states/error/Error";
import { AuthorProfile } from "@/components/shared/helpers/AuthorProfile";
import { API_URL } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import React from "react";
import { CommentSection } from "@/components/shared/helpers/CommentSection";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Publication = ({ publicationId }: { publicationId: string }) => {
    // --- хуки ВСЕГДА вызываются ---
    const { data: user } = useUser();
    const { data: publication, isLoading, isError } = usePublication(publicationId);
    const likePublication = useLikePublication();
    const unLikePublication = useUnlikePublication();

    // --- безопасно получаем locale ---
    const locale =
        typeof window !== "undefined" ? localStorage.getItem("locale") || "en" : "en";

    // --- защита от undefined ---
    const formattedDate = publication?.createdAt
        ? formatDistanceToNow(new Date(publication.createdAt), {
            addSuffix: true,
            locale: locale === "ru" ? ru : enUS,
        })
        : "";

    const handleLike = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (!publication) return;
        likePublication.mutate(publication.id);
    };

    const handleUnlike = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (!publication) return;
        unLikePublication.mutate(publication.id);
    };

    // --- UI с обработкой состояний ---
    if (!user) return <div className="state-center"><NotAuthorized /></div>;
    if (isError) return <div className="state-center"><ExploreError /></div>;
    if (isLoading) return <ExploreLoader />;
    if (!publication) return null;

    return (
        <section className="grid-2 section-padding">
            <div className="flex flex-col items-start justify-center gap-4">
                {publication.videoUrl ? (
                    <video
                        src={`${API_URL}${publication.videoUrl}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="rounded-xl object-cover aspect-square w-full"
                    />
                ) : (
                    <Image
                        src={`${API_URL}${publication.imageUrl}`}
                        width={500}
                        height={500}
                        alt="publication"
                        className="rounded-xl object-cover aspect-square w-full"
                    />
                )}

                <div className="flex flex-col items-start justify-center gap-2 px-4">
                    <div className="flex items-center justify-start gap-4">
                        <button
                            className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1"
                            onClick={publication.isLiked ? handleUnlike : handleLike}
                        >
                            <Heart
                                className={`size-5 ${publication.isLiked ? "text-red-500 fill-red-500" : ""
                                    } stroke-1`}
                            />
                            <span>{publication.likeCount}</span>
                        </button>
                        <button className="flex items-center justify-center bg-none hover:bg-transparent p-0 magic-transition gap-1">
                            <MessageCircle className="size-5 hover:text-white hover:fill-white stroke-1" />
                            <span>{publication.commentCount}</span>
                        </button>
                    </div>
                    <div className="my-1">{publication.content}</div>
                    <div className="text-sm secondary-text mb-4">{formattedDate}</div>
                </div>
            </div>
            {/* блок комментариев */}
            <CommentSection publicationId={publicationId} />
        </section>
    );
};