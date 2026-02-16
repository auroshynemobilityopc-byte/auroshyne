const asyncHandler = require('../../../common/utils/asyncHandler');
const technicianJobsService = require('./technicianJobs.service');
const { AppError } = require('../../../common/utils/appError');

exports.getMyJobs = asyncHandler(async (req, res) => {
    const data = await technicianJobsService.getMyJobs(req.user);

    res.status(200).json({
        success: true,
        data,
    });
});

exports.updateJobStatus = asyncHandler(async (req, res) => {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
        throw new AppError('bookingId and status required', 400);
    }

    const data = await technicianJobsService.updateJobStatus(
        { bookingId, status },
        req.user
    );

    res.status(200).json({
        success: true,
        message: 'Job status updated',
        data,
    });
});
