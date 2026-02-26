const asyncHandler = require('../../common/utils/asyncHandler');
const discountService = require('./discount.service');
const {
    createDiscountDTO,
    updateDiscountDTO,
    paginationDTO,
} = require('./discount.dto');
const { AppError } = require('../../common/utils/appError');
const Joi = require('joi');

exports.createDiscount = asyncHandler(async (req, res) => {
    const { error, value } = createDiscountDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await discountService.createDiscount(value);

    res.status(201).json({
        success: true,
        message: 'Discount created',
        data,
    });
});

exports.getDiscounts = asyncHandler(async (req, res) => {
    const { error, value } = paginationDTO.validate(req.query);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await discountService.getDiscounts(value, req.user.role);

    res.status(200).json({
        success: true,
        message: 'Discounts fetched',
        ...data,
    });
});

exports.getDiscountById = asyncHandler(async (req, res) => {
    const data = await discountService.getDiscountById(req.params.id);

    res.status(200).json({ success: true, data });
});

exports.updateDiscount = asyncHandler(async (req, res) => {
    const { error, value } = updateDiscountDTO.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const data = await discountService.updateDiscount(req.params.id, value);

    res.status(200).json({
        success: true,
        message: 'Discount updated',
        data,
    });
});

exports.deleteDiscount = asyncHandler(async (req, res) => {
    await discountService.deleteDiscount(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Discount deleted',
    });
});

exports.validateDiscount = asyncHandler(async (req, res) => {
    const { code, orderValue } = req.body;
    if (!code) throw new AppError('Discount code is required', 400);
    if (orderValue === undefined || orderValue === null) throw new AppError('Order value is required', 400);

    const data = await discountService.validateDiscountCode(code, Number(orderValue));

    res.status(200).json({
        success: true,
        message: 'Discount valid',
        data,
    });
});
