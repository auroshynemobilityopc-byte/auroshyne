const Review = require('./review.model');
const Booking = require('../bookings/booking.model');
const AppError = require('../../common/utils/appError');
const asyncHandler = require('../../common/utils/asyncHandler');

exports.createReview = asyncHandler(async (req, res, next) => {
    const { bookingId, rating, comment } = req.body;

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
        return next(new AppError('Review already exists for this booking', 400));
    }

    // Check if booking exists and is COMPLETED
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return next(new AppError('Booking not found', 404));
    }
    if (booking.status !== 'COMPLETED') {
        return next(new AppError('Can only review completed bookings', 400));
    }

    // Make sure user owns the booking
    if (booking.userId.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to review this booking', 403));
    }

    const review = await Review.create({
        bookingId,
        customerId: req.user._id,
        rating,
        comment
    });

    res.status(201).json({
        success: true,
        data: review
    });
});

exports.getAllReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find()
        .populate('customerId', 'name email profilePic mobile')
        .populate({
            path: 'bookingId',
            select: 'bookingId date slot customer'
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

exports.getTopReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ isApproved: true, rating: { $gte: 4 } })
        .populate('customerId', 'name firstName lastName')
        .sort({ rating: -1, createdAt: -1 })
        .limit(3);

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    res.status(200).json({
        success: true,
        data: null
    });
});

exports.getReviewForBooking = asyncHandler(async (req, res, next) => {
    const review = await Review.findOne({ bookingId: req.params.bookingId });

    // We don't error out if no review found, just return null
    res.status(200).json({
        success: true,
        data: review || null
    });
});

exports.updateReview = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;
    
    let review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new AppError('Review not found', 404));
    }
    
    // Make sure user owns the review
    if (review.customerId.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to update this review', 403));
    }
    
    review.rating = rating || review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    
    await review.save();
    
    res.status(200).json({
        success: true,
        data: review
    });
});
