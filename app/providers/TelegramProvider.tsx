"use client";

import api from "@/lib/api";
import Script from "next/script";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isMounted && typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;

      tg.ready();
      tg.expand();

      const initData = tg.initData;

      if (initData) {
        api
          .post("/auth/telegram", { initData })
          .then(({ data }) => {
            queryClient.setQueryData(["auth", "me"], data.data.user);

            if (window.location.pathname.includes("/login") || window.location.pathname.includes("/register")) {
              router.push("/");
            }
            toast.success(`Welcome back, ${data.data.user.fullname}!`);
          })
          .catch((err) => {
            console.error("TG Auth failed", err);
          });
      }
    }
  }, [isLoaded, isMounted, queryClient, router]);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onLoad={() => setIsLoaded(true)}
      />
      {children}
    </>
  );
};