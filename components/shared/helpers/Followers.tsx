"use client";

import React, { useState } from "react";

import { UserCard } from "@/components/shared/UserCard";
import { FollowingError } from "@/components/states/errors/Errors";
import { ListLoader } from "@/components/states/loaders/Loaders";
import { Separator } from "@/components/ui/separator";
import { useMyFollowers, useSubscribe, useUnsubscribe } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";

export const Followers = () => {
  const { data, isLoading, isError } = useMyFollowers();

  // локальное состояние для мгновенного обновления UI
  const [localFollowers, setLocalFollowers] = useState<UserAttributes[] | null>(null);

  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const handleFollowToggle = (user: UserAttributes) => {
    // если локальное состояние ещё не создано — создаём на основе data
    if (!localFollowers && data) {
      setLocalFollowers(data);
    }

    setLocalFollowers((prev) => {
      const list = prev ?? data ?? [];
      return list.map((u: UserAttributes) => (u.id === user.id ? { ...u, isFollowing: !u.isFollowing } : u));
    });

    // делаем вызов мутации
    if (user.isFollowing) {
      unsubscribeMutation.mutate(user.id, {
        onError: () => {
          // если ошибка — откатываем
          setLocalFollowers(
            (prev) => prev?.map((u) => (u.id === user.id ? { ...u, isFollowing: user.isFollowing } : u)) ?? null
          );
        },
      });
    } else {
      subscribeMutation.mutate(user.id, {
        onError: () => {
          setLocalFollowers(
            (prev) => prev?.map((u) => (u.id === user.id ? { ...u, isFollowing: user.isFollowing } : u)) ?? null
          );
        },
      });
    }
  };

  if (isLoading) return <ListLoader />;
  if (isError) return <FollowingError />;

  const followers = localFollowers ?? data ?? [];

  return (
    <section className="section-flex container mx-auto max-w-6xl mt-4">
      <h1 className="title-text">Подписчики</h1>
      <Separator orientation="horizontal" className="my-2" />

      <div className="flex-column space-y-2">
        {followers.length > 0 ? (
          followers.map((user: UserAttributes) => (
            <UserCard
              key={user.id}
              user={user}
              handleFollowToggle={handleFollowToggle}
              isPending={subscribeMutation.isPending || unsubscribeMutation.isPending}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">У тебя пока нет подписчиков</p>
        )}
      </div>
    </section>
  );
};
