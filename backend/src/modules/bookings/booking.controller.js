const asyncHandler = require('../../common/utils/asyncHandler');
const bookingService = require('./booking.service');
const {
    createBookingDTO,
    bulkBookingDTO,
    assignTechnicianDTO,
    updateBookingStatusDTO,
    updatePaymentDTO,
} = require('./booking.dto');
const { AppError } = require('../../common/utils/appError');

exports.createBooking = asyncHandler(async (req, res) => {
    const { error, value } = createBookingDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await bookingService.createBooking(value, req.user._id);

    res.status(201).json({ success: true, data });
});

exports.bulkBooking = asyncHandler(async (req, res) => {
    const { error, value } = bulkBookingDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await bookingService.bulkBooking(value, req.user._id);

    res.status(201).json({ success: true, data });
});

exports.assignTechnician = asyncHandler(async (req, res) => {
    const { error, value } = assignTechnicianDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await bookingService.assignTechnician(value);

    res.status(200).json({ success: true, data });
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const { error, value } = updateBookingStatusDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await bookingService.updateBookingStatus(value);

    res.status(200).json({ success: true, data });
});

exports.updatePayment = asyncHandler(async (req, res) => {
    const { error, value } = updatePaymentDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await bookingService.updatePayment(value);

    res.status(200).json({ success: true, data });
});

exports.getBookings = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;

    const data = await bookingService.getBookings(
        filters,
        Number(page),
        Number(limit)
    );

    res.status(200).json({ success: true, ...data });
});

exports.getBookingById = asyncHandler(async (req, res) => {
    const data = await bookingService.getBookingById(req.params.id);

    res.status(200).json({ success: true, data });
});

exports.getSlotBookings = asyncHandler(async (req, res) => {
    const data = await bookingService.getSlotBookings(
        req.params.date,
        req.params.slot
    );

    res.status(200).json({ success: true, data });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
    const data = await bookingService.getMyBookings(req.user._id);
    res.status(200).json({ success: true, data });
});

exports.cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;
    if (!bookingId) throw new AppError('bookingId is required', 400);
    const data = await bookingService.cancelBooking(bookingId, req.user._id);
    res.status(200).json({ success: true, data });
});

exports.requestRefund = asyncHandler(async (req, res) => {
    const { bookingId, reason } = req.body;
    if (!bookingId) throw new AppError('bookingId is required', 400);
    const data = await bookingService.requestRefund(bookingId, req.user._id, reason);
    res.status(200).json({ success: true, data });
});

exports.updateBookingByCustomer = asyncHandler(async (req, res) => {
    const { bookingId, ...updates } = req.body;
    if (!bookingId) throw new AppError('bookingId is required', 400);
    const data = await bookingService.updateBookingByCustomer(bookingId, req.user._id, updates);
    res.status(200).json({ success: true, data });
});
