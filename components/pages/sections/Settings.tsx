"use client";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/functions/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/functions/LanguageSwitcher";

export const Settings = () => {
    const t = useTranslations("Pages.Settings");
    const logoutMutation = useLogout();

    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    return (
        <section className="flex flex-col container mx-auto max-w-6xl rounded-t-2xl px-2 mt-4">
            {/* Back button */}
            <Link href="/profile" className="flex items-center justify-start link-text">
                <ChevronLeft />
                {t("BackToProfile")}
            </Link>
            {/* Title */}
            <h1 className="title-text my-3">{t("Title")}</h1>
            {/* Separator */}
            <Separator className="bg-muted my-2" />
            {/* Language Switch */}
            <div className="flex justify-between items-center w-full">
                <div className="text-base">{t("Language")}</div>
                <div><LanguageSwitcher /></div>
            </div>
            {/* Separator */}
            <Separator className="bg-muted my-2" />
            {/* Theme Switch */}
            <div className="flex justify-between items-center w-full">
                <div className="text-base">{t("Theme")}</div>
                <div><ThemeSwitcher /></div>
            </div>
            <Separator className="bg-muted my-2" />
            {/* Logout Button */}
            <div className="flex items-end justify-center">
                <Button className="w-full h-8 cursor-pointer bg-red-400 hover:bg-red-500 text-white" onClick={logout}>
                    {t("Logout")}
                </Button>
            </div>
        </section>
    );
};