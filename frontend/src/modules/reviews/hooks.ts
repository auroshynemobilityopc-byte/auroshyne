import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createReview, getReviewForBooking, getTopReviews, getAllReviews, deleteReview, updateReview } from './api';
import toast from 'react-hot-toast';

export const useReviewForBooking = (bookingId: string) => {
    return useQuery({
        queryKey: ['review', bookingId],
        queryFn: () => getReviewForBooking(bookingId),
        enabled: !!bookingId,
    });
};

export const useCreateReview = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createReview,
        onSuccess: (_, variables) => {
            toast.success('Review submitted successfully!');
            qc.invalidateQueries({ queryKey: ['review', variables.bookingId] });
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        },
    });
};

export const useTopReviews = () => {
    return useQuery({
        queryKey: ['topReviews'],
        queryFn: getTopReviews,
    });
};

export const useAllReviews = () => {
    return useQuery({
        queryKey: ['allReviews'],
        queryFn: getAllReviews,
    });
};

export const useDeleteReview = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            toast.success('Review deleted successfully');
            qc.invalidateQueries({ queryKey: ['allReviews'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete review');
        },
    });
};

export const useUpdateReview = (onSuccess?: () => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateReview,
        onSuccess: (data: any) => {
            toast.success('Review updated successfully!');
            if (data?.data?.bookingId) {
                qc.invalidateQueries({ queryKey: ['review', data.data.bookingId] });
            }
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update review');
        },
    });
};
