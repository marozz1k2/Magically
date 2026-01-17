"use client";
import { useEffect } from "react";
import api from "@/lib/api";

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      tg.ready();
      
      // Авто-логин если мы в телеграме
      api.post("/auth/telegram", { initData: tg.initData })
        .then(res => {
          if (res.data.success) {
            console.log("TWA Auth Success");
            // Можно обновить состояние пользователя здесь
          }
        })
        .catch(err => console.error("TWA Auth Error:", err));
    }
  }, []);

  return <>{children}</>;
};
