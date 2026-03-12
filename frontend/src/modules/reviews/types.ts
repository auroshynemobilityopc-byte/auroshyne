export interface Review {
    _id: string;
    bookingId: string | any;
    customerId: string | any;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReviewPayload {
    bookingId: string;
    rating: number;
    comment?: string;
}

export interface UpdateReviewPayload {
    reviewId: string;
    rating?: number;
    comment?: string;
}
