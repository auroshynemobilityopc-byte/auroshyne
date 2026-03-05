import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    pages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ page, pages, total, limit, onPageChange }: PaginationProps) => {
    if (pages <= 1) return null;

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-500">
                Showing <span className="text-zinc-300 font-medium">{from}–{to}</span> of{" "}
                <span className="text-zinc-300 font-medium">{total}</span>
            </span>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1.5">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm text-zinc-400 min-w-[70px] text-center tabular-nums">
                    {page} / {pages}
                </span>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= pages}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
