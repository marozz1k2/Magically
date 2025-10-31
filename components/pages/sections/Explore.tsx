"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { PublicationCard } from "@/components/shared/publication/PublicationCard";
import { ExploreEmpty } from "@/components/states/empty/Empty";
import { ExploreError, NotAuthorized } from "@/components/states/error/Error";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useAuth";
import { usePublications } from "@/hooks/usePublications";
import { ShootingStars } from "@/components/ui/magic/shooting-stars";
import { StarsBackground } from "@/components/ui/magic/stars-background";

export const Explore = () => {
  const { data: user, isError } = useUser();
  const t = useTranslations("Home");
  const { theme } = useTheme();
  const [filters, setFilters] = useState({ sortBy: "newest", hashtag: "" });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePublications(filters);

  const handleFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleHashtagClick = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      hashtag: prev.hashtag === tag ? "" : tag,
    }));
  };

  const categories = ["Higgsfield", "Kling", "GPT", "FalAI"];

  // Динамичные цвета под тему
  const starColor = theme === "dark" ? "#FFFFFF" : "#111111";
  const trailColor = theme === "dark" ? "#F020F0" : "#A174D1";

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* --- Stars Layer --- */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <StarsBackground className="!h-full !w-full opacity-50" />
        <ShootingStars
          starColor={starColor}
          trailColor={trailColor}
          className="!h-full !w-full"
        />
      </div>

      {/* --- Scrollable content --- */}
      <div className="relative z-10 w-full h-full section-padding">
        <h1 className="title-text mt-4 mb-8">Publications</h1>

        <div className="grid-4 mt-4 gap-6">
          {data?.pages.map((page) =>
            page.publications.map((publication: any) => (
              <PublicationCard
                key={publication.id}
                publication={publication}
                userId={user?.id}
              />
            ))
          )}
        </div>

        {data?.pages[0].publications.length === 0 && <ExploreEmpty />}

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          </div>
        )}

        {!user && (
          <div className="state-center mt-10">
            <NotAuthorized />
          </div>
        )}
        {user && isError && (
          <div className="state-center mt-10">
            <ExploreError />
          </div>
        )}
        {user && isLoading && (
          <div className="mt-10">
            <ExploreLoader />
          </div>
        )}
      </div>
    </section>
  );
};
