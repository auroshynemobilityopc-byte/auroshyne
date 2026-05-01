const Setting = require('../settings/setting.model');
const User = require('../users/user.model');
const Booking = require('../bookings/booking.model');
const Discount = require('../discounts/discount.model');
const EmailTemplate = require('../emailTemplates/emailTemplate.model');
const { parseTemplatePlaceholders } = require('../../common/utils/templateParser');

const { AppError } = require('../../common/utils/appError');
const { decrypt } = require('../../common/utils/crypto.util');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');

exports.sendMail = async ({ to, subject, content }) => {
    const setting = await Setting.findOne();
    if (!setting || !setting.emailSettings || setting.emailSettings.provider === 'disabled') {
        throw new AppError('Email service is disabled or not configured', 400);
    }

    const { provider, fromEmail, fromName, nodemailer: nmConfig, resend: rsConfig } = setting.emailSettings;
    const fromStr = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

    if (!fromStr) {
        throw new AppError('From Email is not configured in settings', 400);
    }

    if (provider === 'nodemailer') {
        if (!nmConfig || !nmConfig.host || !nmConfig.user || !nmConfig.pass) {
            throw new AppError('Nodemailer configuration is incomplete', 400);
        }

        const transporter = nodemailer.createTransport({
            host: nmConfig.host,
            port: nmConfig.port || 587,
            secure: Number(nmConfig.port) === 465, // true for 465, false for other ports
            auth: {
                user: nmConfig.user,
                pass: decrypt(nmConfig.pass) || nmConfig.pass
            }
        });

        await transporter.sendMail({
            from: fromStr,
            to,
            subject,
            html: content
        });

    } else if (provider === 'resend') {
        if (!rsConfig || !rsConfig.apiKey) {
            throw new AppError('Resend API Key is not configured', 400);
        }

        const resendKey = decrypt(rsConfig.apiKey) || rsConfig.apiKey;
        const resend = new Resend(resendKey);

        const { error } = await resend.emails.send({
            from: fromStr,
            to: Array.isArray(to) ? to : [to],
            subject,
            html: content
        });

        if (error) {
            throw new AppError(`Failed to send email via Resend: ${error.message}`, 500);
        }
    } else {
        throw new AppError('Invalid email provider configured', 400);
    }
};

exports.sendParsedMail = async ({ to, subject, content, templateId, userId, bookingId, discountId, system }) => {
    let finalContent = content;
    let finalSubject = subject;

    if (templateId) {
        const template = await EmailTemplate.findById(templateId);
        if (template) {
            finalSubject = finalSubject || template.subject;
            finalContent = finalContent || template.body;
        }
    }

    if (!finalContent) throw new AppError('Email content is required', 400);

    // Safely fetch booking first
    const booking = bookingId ? await Booking.findById(bookingId) : null;

    // Resolve userId: prefer explicit userId, fall back to booking.userId
    let resolvedUserId = userId || (booking && booking.userId ? String(booking.userId) : null);

    const user = resolvedUserId ? await User.findById(resolvedUserId) : null;
    const discount = discountId ? await Discount.findById(discountId) : null;

    finalContent = parseTemplatePlaceholders(finalContent, { user: user || {}, booking: booking || {}, discount: discount || {}, system: system || {} });
    if (finalSubject) finalSubject = parseTemplatePlaceholders(finalSubject, { user: user || {}, booking: booking || {}, discount: discount || {}, system: system || {} });

    // Resolve recipient: explicit `to` > user email > booking's customer contact (no email on booking model so skip)
    const recipient = to || (user && user.email) || null;
    if (!recipient) throw new AppError('Recipient email is required. Provide `to`, or ensure the user has an email.', 400);

    return await exports.sendMail({
        to: recipient,
        subject: finalSubject || 'Notification',
        content: finalContent
    });
};

exports.sendSupportMail = async ({ fromEmail, fromName, subject, message }) => {
    const { ADMIN } = require('../../common/constants/roles');

    // Fetch all active admin users
    const admins = await User.find({ role: ADMIN, isActive: true }).select('email').lean();

    // Fallback: if no admins found, use the configured fromEmail from settings
    let adminEmails = admins.map(a => a.email).filter(Boolean);
    if (!adminEmails.length) {
        const setting = await Setting.findOne();
        const fallback = setting?.emailSettings?.fromEmail;
        if (fallback) adminEmails = [fallback];
    }

    if (!adminEmails.length) {
        throw new AppError('No admin email addresses found to deliver support request', 500);
    }

    const supportContent = `
        <h3>New Support Request</h3>
        <p><strong>From:</strong> ${fromName} (${fromEmail})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p>${message}</p>
    `;

    return await exports.sendMail({
        to: adminEmails,           // nodemailer & resend both support arrays
        subject: `Support Request: ${subject}`,
        content: supportContent
    });
};

/**
 * sendAutoEmail – fire-and-forget helper called from business services.
 *
 * @param {string} trigger  - 'newBooking' | 'newRegistration' | 'bookingCompleted'
 * @param {object} ctx      - { userId?, bookingId? }
 */
exports.sendAutoEmail = async (trigger, ctx = {}) => {
    try {
        const setting = await Setting.findOne().lean();
        if (!setting) return;

        // If email provider is disabled globally, skip
        if (!setting.emailSettings || setting.emailSettings.provider === 'disabled') return;

        const triggerCfg = setting.autoEmails?.[trigger];
        if (!triggerCfg || !triggerCfg.enabled || !triggerCfg.templateId) return;

        await exports.sendParsedMail({
            templateId: String(triggerCfg.templateId),
            userId:     ctx.userId     ? String(ctx.userId)    : undefined,
            bookingId:  ctx.bookingId  ? String(ctx.bookingId) : undefined,
            system:     ctx.system || {},
        });
    } catch (err) {
        // Never crash the caller — just log
        console.error(`[AutoEmail] Failed to send "${trigger}" email:`, err.message);
    }
};
