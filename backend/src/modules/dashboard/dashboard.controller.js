const asyncHandler = require('../../common/utils/asyncHandler');
const dashboardService = require('./dashboard.service');

exports.getSummary = asyncHandler(async (req, res) => {
    const data = await dashboardService.getSummary();

    res.status(200).json({
        success: true,
        data,
    });
});
