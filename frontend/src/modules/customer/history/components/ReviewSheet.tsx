import { useState, useEffect } from "react";
import { Drawer } from "../../../../components/shared/Drawer";
import { X, Star, MessageSquare, Edit2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useCreateReview, useReviewForBooking, useUpdateReview } from "../../../reviews/hooks";

interface Props {
    booking: any;
    open: boolean;
    onClose: () => void;
}

export const ReviewSheet = ({ booking, open, onClose }: Props) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const { data: existingReview, isLoading } = useReviewForBooking(booking?._id);
    const createReviewMutation = useCreateReview(() => {
        onClose();
    });
    const updateReviewMutation = useUpdateReview(() => {
        setIsEditing(false);
        onClose();
    });

    useEffect(() => {
        if (!open) {
            setRating(0);
            setHoverRating(0);
            setComment("");
            setIsEditing(false);
        }
    }, [open]);

    if (!booking) return null;

    const handleSubmit = () => {
        if (rating === 0) return;
        
        if (isEditing && existingReview) {
            updateReviewMutation.mutate({
                reviewId: existingReview._id,
                rating,
                comment
            });
        } else {
            createReviewMutation.mutate({
                bookingId: booking._id,
                rating,
                comment
            });
        }
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 border-b border-zinc-800 pb-4">
                    <div className="flex-1">
                        <span className="text-xs font-mono text-text-grey mb-1 block">#{booking.bookingId}</span>
                        <h2 className="text-xl font-bold">{existingReview ? "View / Edit Review" : "Leave a Review"}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pb-24">
                    {isLoading ? (
                        <div className="text-center py-10 text-text-grey animate-pulse">Loading...</div>
                    ) : existingReview && !isEditing ? (
                        <div className="bg-charcoal-800 p-6 rounded-2xl border border-white/5 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Thank you for your feedback!</h3>
                            <p className="text-sm text-text-grey">You have already submitted a review for this booking.</p>

                            <div className="mt-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5 space-y-3 relative group">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setRating(existingReview.rating);
                                        setComment(existingReview.comment);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span className="sr-only">Edit review</span>
                                </button>
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "w-6 h-6",
                                                star <= existingReview.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-zinc-700"
                                            )}
                                        />
                                    ))}
                                </div>
                                {existingReview.comment && (
                                    <p className="text-sm italic text-zinc-300">"{existingReview.comment}"</p>
                                )}
                                <div className="text-xs text-brand-blue/80 mt-2 font-medium cursor-pointer" onClick={() => {
                                        setIsEditing(true);
                                        setRating(existingReview.rating);
                                        setComment(existingReview.comment);
                                    }}>
                                    Edit Review
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 text-center">
                                <p className="text-sm font-medium text-zinc-300">How was your experience?</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-10 h-10 transition-colors",
                                                    (hoverRating || rating) >= star
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-zinc-700 hover:text-yellow-400/50"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-zinc-300">Tell us more (Optional)</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you like or dislike?"
                                    rows={4}
                                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-brand-blue/50 transition-colors"
                                />
                            </div>

                            <div className="flex gap-3">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setRating(0);
                                            setComment("");
                                        }}
                                        className="w-1/3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl py-3.5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || createReviewMutation.isPending || updateReviewMutation.isPending}
                                    className={cn(
                                        "bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl py-3.5 transition-colors",
                                        isEditing ? "w-2/3" : "w-full"
                                    )}
                                >
                                    {createReviewMutation.isPending || updateReviewMutation.isPending
                                        ? "Submitting..."
                                        : isEditing ? "Update Review" : "Submit Review"
                                    }
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Drawer>
    );
};
