"use client";

import { useState } from "react";

import { UserCard } from "@/components/shared/UserCard";
import { FollowingError } from "@/components/states/errors/Errors";
import { ListLoader } from "@/components/states/loaders/Loaders";
import { Separator } from "@/components/ui/separator";
import { useMyFollowing, useSubscribe, useUnsubscribe } from "@/hooks/useProfile";
import { UserAttributes } from "@/types";

export const Following = () => {
  const { data, isLoading, isError } = useMyFollowing();

  // локальное состояние для мгновенного UI обновления
  const [localFollowings, setLocalFollowings] = useState<UserAttributes[] | null>(null);

  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  const handleFollowToggle = (user: UserAttributes) => {
    // если локальные данные ещё не заданы — скопировать из data
    if (!localFollowings && data) {
      setLocalFollowings(data);
    }

    setLocalFollowings((prev) => {
      const list = prev ?? data ?? [];
      return list.map((u: UserAttributes) => (u.id === user.id ? { ...u, isFollowing: !u.isFollowing } : u));
    });

    // запуск мутации
    if (user.isFollowing) {
      unsubscribeMutation.mutate(user.id, {
        onError: () => {
          // откат, если сервер вернул ошибку
          setLocalFollowings(
            (prev) => prev?.map((u) => (u.id === user.id ? { ...u, isFollowing: user.isFollowing } : u)) ?? null
          );
        },
      });
    } else {
      subscribeMutation.mutate(user.id, {
        onError: () => {
          setLocalFollowings(
            (prev) => prev?.map((u) => (u.id === user.id ? { ...u, isFollowing: user.isFollowing } : u)) ?? null
          );
        },
      });
    }
  };

  if (isLoading) return <ListLoader />;
  if (isError) return <FollowingError />;

  // показываем локальные данные, если они есть, иначе — API данные
  const followings = localFollowings ?? data ?? [];

  return (
    <section className="section-flex container mx-auto max-w-6xl mt-4">
      <h1 className="title-text mt-4">Подписки</h1>
      <Separator orientation="horizontal" className="my-2" />

      <div className="flex-column space-y-2">
        {followings.length > 0 ? (
          followings.map((user: UserAttributes) => (
            <UserCard
              key={user.id}
              user={user}
              handleFollowToggle={handleFollowToggle}
              isPending={subscribeMutation.isPending || unsubscribeMutation.isPending}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">Нет подписок</p>
        )}
      </div>
    </section>
  );
};
