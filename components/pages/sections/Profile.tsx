"use client"

import { useMyProfile } from "@/hooks/useProfile";
import { ProfileLoader } from "@/components/states/loaders/Loaders";
import { ExploreError, NotAuthorized } from "@/components/states/error/Error";

export const Profile = () => {
  const { data: user, isLoading, isError } = useMyProfile();
  return (
    <section className="flex items-center justify-center w-full h-full section-padding container">
      <div className="flex items-center justify-center w-full max-w-96">
        {!user && <NotAuthorized />}
        {user && isLoading && <ProfileLoader />}
        {user && isError && <ExploreError />}
      </div>
    </section>
  );
};
