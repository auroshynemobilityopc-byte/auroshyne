const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

// Public route
router.get('/top', reviewController.getTopReviews);
router.get('/booking/:bookingId', protect, reviewController.getReviewForBooking);

// Protected routes (Admin & Customer)
router.use(protect);

router.route('/')
    .get(allowRoles(CUSTOMER, ADMIN), reviewController.getAllReviews)
    .post(allowRoles(CUSTOMER), reviewController.createReview);

router.route('/:id')
    .patch(allowRoles(CUSTOMER), reviewController.updateReview)
    .delete(allowRoles(ADMIN), reviewController.deleteReview);

module.exports = router;
