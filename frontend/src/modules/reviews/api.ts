import { customerApi } from '../../app/customer/customerApi';
import { api as adminApi } from '../../lib/apiClient/axios';
import type { CreateReviewPayload } from './types';

export const createReview = async (data: CreateReviewPayload) => {
    const response = await customerApi.post('/reviews', data);
    return response.data;
};

export const getReviewForBooking = async (bookingId: string) => {
    const response = await customerApi.get(`/reviews/booking/${bookingId}`);
    return response.data.data;
};

export const getTopReviews = async () => {
    const response = await customerApi.get('/reviews/top');
    return response.data.data;
};

export const getAllReviews = async () => {
    const response = await adminApi.get('/reviews');
    return response.data.data;
};

export const deleteReview = async (id: string) => {
    const response = await adminApi.delete(`/reviews/${id}`);
    return response.data;
};

export const updateReview = async (data: { reviewId: string; rating?: number; comment?: string }) => {
    const { reviewId, ...updateData } = data;
    const response = await customerApi.patch(`/reviews/${reviewId}`, updateData);
    return response.data;
};
