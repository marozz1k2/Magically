"use client";

import Image from "next/image";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { API_URL } from "@/lib/api";
import { useUser } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useGallery } from "@/hooks/useGallery";

import { Input } from "@/components/ui/input";
import { LibraryEmpty } from "@/components/states/empty/Empty";
import { ExploreLoader } from "@/components/states/loaders/Loaders";
import { LibraryError, NotAuthorized } from "@/components/states/error/Error";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Library = () => {
  const t = useTranslations("Pages.Library");
  const { data: user } = useUser();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({ sortBy: "newest", searchQuery: "", date: "" });
  const { data: galleryItems, isLoading, isError } = useGallery(filters);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="text-green-500" />;
      case "failed":
        return <XCircle className="text-red-500" />;
      case "processing":
        return <Loader2 className="animate-spin text-blue-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="state-center">
        <NotAuthorized />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="state-center">
        <LibraryError />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section-padding">
        <ExploreLoader />
      </div>
    );
  }

  return (
    <section className="container mx-auto section-padding">
      <h1 className="title-text mt-4 my-2">{t("title")}</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder={t("search")}
          className="w-full"
          value={filters.searchQuery}
          onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
        />
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(v) => setFilters((p) => ({ ...p, sortBy: v }))}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("newest")}</SelectItem>
              <SelectItem value="oldest">{t("oldest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isLoading && !isError && galleryItems?.length === 0 && <LibraryEmpty />}

      <div className="grid-4 gap-4">
        {galleryItems?.map((item) => {
          const isVideo = item.imageUrl.endsWith(".mp4");
          return (
            <div key={item.id} className="relative group">
              {isVideo ? (
                <video
                  src={`${API_URL}${item.imageUrl}`}
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-auto rounded-lg object-cover aspect-square"
                />
              ) : (
                <Image
                  src={`${API_URL}${item.imageUrl}`}
                  alt={item.prompt}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg object-cover aspect-square"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-3xl text-white p-2 text-xs rounded-b-lg transition-opacity">
                {item.prompt}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};