import React from "react";
import { cn } from "@/lib/utils";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export const ArticleCard = React.memo(({
    index,
    hovered,
    setHovered,
    children,
    className,
    onClick
}: {
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => (
    <div
        className={cn(
            hovered !== null && hovered !== index ? "blur-sm scale-[0.98] transition-all duration-350 ease-out" : "transition-all duration-350 ease-out",
        )}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
    >
        <CardSpotlight
            className={className}
            onClick={onClick}
        >
            {children}
        </CardSpotlight>
    </div>
));

