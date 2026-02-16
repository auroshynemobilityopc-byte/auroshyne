import React, { useRef } from "react";

interface Props {
    children: React.ReactNode;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

export const SwipeRow: React.FC<Props> = ({
    children,
    onSwipeLeft,
    onSwipeRight,
}) => {
    const startX = useRef<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (startX.current === null) return;

        const diff = e.changedTouches[0].clientX - startX.current;

        if (diff > 80) onSwipeRight();
        if (diff < -80) onSwipeLeft();

        startX.current = null;
    };

    return (
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {children}
        </div>
    );
};
