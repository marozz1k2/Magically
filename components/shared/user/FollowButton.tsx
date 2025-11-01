"use client";

import { Button } from "@/components/ui/button";
import { useSubscribe, useUnsubscribe } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";
import { useTranslations } from "next-intl";

export const FollowButton = (user: UserAttributes) => {
  const t = useTranslations("Components.FollowButton")
  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const handleFollowToggle = (user: UserAttributes) => {
    user.isFollowing ? unsubscribeMutation.mutate(user.id) : subscribeMutation.mutate(user.id);
  };

  return (
    <Button
      className={user.isFollowing ? "btn-outline" : "btn-solid"}
      onClick={() => handleFollowToggle(user)}
      disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
    >
      {user.isFollowing ? t("Unfollow") : t("Follow")}
    </Button>
  );
};
