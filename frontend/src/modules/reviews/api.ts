import { customerApi as api } from '../../app/customer/customerApi';
import type { CreateReviewPayload } from './types';

export const createReview = async (data: CreateReviewPayload) => {
    const response = await api.post('/reviews', data);
    return response.data;
};

export const getReviewForBooking = async (bookingId: string) => {
    const response = await api.get(`/reviews/booking/${bookingId}`);
    return response.data.data;
};

export const getTopReviews = async () => {
    const response = await api.get('/reviews/top');
    return response.data.data;
};

export const getAllReviews = async () => {
    const response = await api.get('/reviews');
    return response.data.data;
};

export const deleteReview = async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
};

export const updateReview = async (data: { reviewId: string; rating?: number; comment?: string }) => {
    const { reviewId, ...updateData } = data;
    const response = await api.patch(`/reviews/${reviewId}`, updateData);
    return response.data;
};
