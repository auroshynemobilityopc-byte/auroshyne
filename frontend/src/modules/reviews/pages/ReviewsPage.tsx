import { useState } from "react";
import { useAllReviews, useDeleteReview } from "../hooks";
import { Star, Trash2, Calendar, Hash, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../customer/lib/utils";

export const ReviewsPage = () => {
    const { data: reviews, isLoading, refetch } = useAllReviews();
    const deleteReviewMutation = useDeleteReview();
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        deleteReviewMutation.mutate(id, {
            onSuccess: () => {
                setConfirmDelete(null);
                refetch();
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Customer Reviews</h1>
                    <p className="text-zinc-400 text-sm">Manage and monitor customer feedback</p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800" />
                    ))}
                </div>
            ) : !reviews || reviews.length === 0 ? (
                <div className="bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-800">
                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-bold">No reviews yet</h3>
                    <p className="text-zinc-400">Reviews will appear here once customers start providing feedback.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review: any) => (
                        <div
                            key={review._id}
                            className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-4 hover:border-brand-blue/30 transition-colors group relative"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                                        {review.customerId?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm line-clamp-1">{review.customerId?.name || "Deleted User"}</p>
                                        <p className="text-xs text-zinc-500">{review.customerId?.mobile || ""}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "w-3.5 h-3.5",
                                                star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-700"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <Hash className="w-3 h-3" />
                                    <span>#{review.bookingId?.bookingId || "N/A"}</span>
                                    <span className="mx-1">•</span>
                                    <Calendar className="w-3 h-3" />
                                    <span>{format(new Date(review.createdAt), "dd MMM yyyy")}</span>
                                </div>
                                <p className="text-sm text-zinc-300 italic">
                                    "{review.comment || "No comment provided."}"
                                </p>
                            </div>

                            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                    review.isApproved ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                )}>
                                    {review.isApproved ? "Public" : "Pending"}
                                </span>

                                {confirmDelete === review._id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(review._id)}
                                            className="text-xs font-bold text-red-500 hover:underline"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(null)}
                                            className="text-xs font-bold text-zinc-500 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(review._id)}
                                        className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
