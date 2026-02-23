/**
 * OfflineButton Component
 * Button that is disabled when offline and shows visual feedback
 */

import React from 'react';
import { useOffline } from '../../../../lib/OfflineContext';
import { WifiOff } from 'lucide-react';

interface OfflineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    showOfflineIcon?: boolean;
}

export function OfflineButton({
    children,
    onClick,
    disabled,
    showOfflineIcon = true,
    className = '',
    ...props
}: OfflineButtonProps) {
    const { isOffline } = useOffline();
    const isDisabled = disabled || isOffline;

    return (
        <button
            onClick={isOffline ? (e) => {
                e.preventDefault();
                e.stopPropagation();
            } : onClick}
            disabled={isDisabled}
            title={isOffline ? 'This action requires internet connection' : undefined}
            className={`
                relative transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isDisabled ? 'hover:bg-opacity-80' : ''}
                ${className}
            `}
            {...props}
        >
            <div className="flex items-center gap-2">
                {showOfflineIcon && isOffline && (
                    <WifiOff className="w-4 h-4" />
                )}
                {children}
            </div>
        </button>
    );
}

/**
 * OfflineAlert Component
 * Shows alert when trying to use offline features
 */
export function OfflineAlert() {
    const { isOffline, lastSyncedAt } = useOffline();

    if (!isOffline) return null;

    const formatTime = (timestamp: number | null) => {
        if (!timestamp) return "Never synced";
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4 text-sm text-amber-200">
            <div className="flex items-start gap-3">
                <WifiOff className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                    <div className="font-semibold">Offline Mode</div>
                    <div className="text-xs text-amber-200/70 mt-1">
                        You're currently offline. Data shown is from {formatTime(lastSyncedAt)}.
                        Online actions like booking, payments, and profile updates are disabled.
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * OfflineFeatureGuard Component
 * Wrapper that prevents interaction with offline-incompatible features
 */
export function OfflineFeatureGuard({
    children,
    fallback = "This feature requires internet connection",
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { isOffline } = useOffline();

    if (isOffline) {
        return (
            <div className="opacity-50 pointer-events-none cursor-not-allowed">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                    <span className="text-sm text-white font-medium">{fallback}</span>
                </div>
                {children}
            </div>
        );
    }

    return <>{children}</>;
}
