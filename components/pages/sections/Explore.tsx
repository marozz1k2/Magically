"use client"

import { useUser } from "@/hooks/useAuth";
import { ExploreError, NotAuthorized } from "@/components/states/error/Error";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { usePublications } from "@/hooks/usePublications";
import { ExploreEmpty } from "@/components/states/empty/Empty";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PublicationCard } from "@/components/shared/helpers/PublicationCard";

export const Explore = () => {
    const { data: user, isError } = useUser();

    const t = useTranslations("Home");
    const [filters, setFilters] = useState({ sortBy: "newest", hashtag: "" });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePublications(filters);

    const handleFilterChange = (value: string) => {
        setFilters((prev) => ({ ...prev, sortBy: value }));
    };

    const handleHashtagClick = (tag: string) => {
        setFilters((prev) => ({ ...prev, hashtag: prev.hashtag === tag ? "" : tag }));
    };

    const categories = ["Higgsfield", "Kling", "GPT", "FalAI"];

    return (
        <section className="w-full h-full section-padding">
            {/* States Handler */}
            {!user && <div className="state-center"><NotAuthorized /></div>}
            {user && isError && <div className="state-center"><ExploreError /></div>}
            {user && isLoading && <ExploreLoader />}

            {/* Publications fetch */}
            <div>
                <ScrollArea className="w-72 overflow-hidden">
                    <div className="flex gap-2 py-2 pb-4 w-max">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={filters.hashtag === category ? "default" : "outline"}
                                className="min-w-max"
                                onClick={() => handleHashtagClick(category)}
                            >
                                #{category}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="bg-transparent" />
                </ScrollArea>


                <div className="grid-4 mt-4">
                    {data?.pages.map((page) => page.publications.map((pub: any) => <PublicationCard key={pub.id} pub={pub} />))}
                </div>

                {data?.pages[0].publications.length === 0 && <ExploreEmpty />}

                {hasNextPage && (
                    <div className="flex-center mt-6">
                        <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                            {isFetchingNextPage ? "Loading more..." : "Load More"}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};