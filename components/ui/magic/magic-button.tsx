"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const MagicButton = ({ icon: Icon, className, ...props }: any) => {
    const [stars, setStars] = useState<
        { left: number; top: number; scale: number; delay: number }[]
    >([]);
    const [shooting, setShooting] = useState<{ delay: number }[]>([]);

    useEffect(() => {
        // Генерируем звезды только на клиенте
        const generatedStars = Array.from({ length: 20 }).map(() => ({
            left: Math.random() * 240,
            top: Math.random() * 55,
            scale: Math.random() * 2,
            delay: Math.random() * 5,
        }));

        const generatedShooting = Array.from({ length: 4 }).map(() => ({
            delay: Math.random() * 5,
        }));

        setStars(generatedStars);
        setShooting(generatedShooting);
    }, []);

    return (
        <div className={cn("special-btn", className)}>
            <button type="button" {...props}>
                <span className="flex items-center justify-center w-full h-full">
                    <Icon className="size-5" />
                </span>

                {/* Рендерим только после hydration */}
                {stars.map((s, i) => (
                    <div
                        key={`star-${i}`}
                        className="star"
                        style={{
                            left: `${s.left}px`,
                            top: `${s.top}px`,
                            transform: `scale(${s.scale})`,
                            animationDelay: `${s.delay}s`,
                        }}
                    />
                ))}

                {shooting.map((s, i) => (
                    <div
                        key={`shoot-${i}`}
                        className={`shooting-star shooting-star-${i + 1}`}
                        style={{ animationDelay: `${s.delay}s` }}
                    />
                ))}
            </button>
        </div>
    );
}
