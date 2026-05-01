/**
 * Mail Template Placeholder Changer 
 * Replaces placeholders like {{user.name}} with data from specific models.
 */

const resolvePath = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
        return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj) || '';
};

/**
 * Parses an email template, replacing placeholders with actual data
 * 
 * @param {String} templateBody The raw HTML or text template string
 * @param {Object} data Context data: { user, booking, discount, system }
 * @returns {String} Parsed template
 */
exports.parseTemplatePlaceholders = (templateBody, { user = {}, booking = {}, discount = {}, system = {} } = {}) => {
    if (!templateBody) return '';

    // Create a safe map to expose explicitly allowed properties
    const contextMap = {
        user: {
            name: user.name || '',
            email: user.email || '',
            mobile: user.mobile || '',
            role: user.role || '',
        },
        booking: {
            id: booking.bookingId || '',
            category: booking.category || '',
            slot: booking.slot || '',
            date: booking.date || '',
            status: booking.status || '',
            totalAmount: booking.totalAmount || 0,
            tax: booking.tax || 0,
            discount: booking.discount || 0,
            customerName: booking?.customer?.name || '',
            customerMobile: booking?.customer?.mobile || '',
            customerAddress: booking?.customer?.address || '',
            customerApartment: booking?.customer?.apartmentName || '',
            vehiclesCount: booking?.vehicles?.length || 0,
            paymentMethod: booking?.payment?.method || '',
            paymentStatus: booking?.payment?.status || '',
            paymentTransactionId: booking?.payment?.transactionId || '',
        },
        discount: {
            code: discount.code || '',
            type: discount.type || '',
            value: discount.value || 0,
            description: discount.description || '',
        },
        system: {
            resetLink: system.resetLink || '',
        }
    };

    // Replace occurrences of {{ placeholder }} (handles spaces gracefully)
    return templateBody.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
        const resolvedValue = resolvePath(contextMap, path);
        return resolvedValue !== null && resolvedValue !== undefined ? String(resolvedValue) : '';
    });
};

/**
 * Get available placeholders for frontend or admin panel use
 */
exports.getAvailablePlaceholders = () => {
    return [
        { key: '{{user.name}}', description: 'Name of the user (customer/technician/admin)' },
        { key: '{{user.email}}', description: "User's email address" },
        { key: '{{user.mobile}}', description: "User's mobile number" },

        { key: '{{booking.id}}', description: 'Booking unique ID' },
        { key: '{{booking.category}}', description: 'Booking category (private/commercial)' },
        { key: '{{booking.slot}}', description: 'Booking time slot (MORNING, etc)' },
        { key: '{{booking.date}}', description: 'Booking date' },
        { key: '{{booking.status}}', description: 'Booking status (PENDING, etc)' },
        { key: '{{booking.totalAmount}}', description: 'Total booking amount' },
        { key: '{{booking.tax}}', description: 'Tax amount applied' },
        { key: '{{booking.discount}}', description: 'Discount amount applied' },

        { key: '{{booking.customerName}}', description: "Customer's booking name" },
        { key: '{{booking.customerMobile}}', description: "Customer's booking mobile" },
        { key: '{{booking.customerAddress}}', description: "Customer's booking address" },
        { key: '{{booking.customerApartment}}', description: "Customer's apartment name" },
        { key: '{{booking.vehiclesCount}}', description: 'Number of booked vehicles' },

        { key: '{{booking.paymentMethod}}', description: 'Booking payment method' },
        { key: '{{booking.paymentStatus}}', description: 'Booking payment status' },
        { key: '{{booking.paymentTransactionId}}', description: 'Booking payment transaction ID' },

        { key: '{{discount.code}}', description: 'Discount code text' },
        { key: '{{discount.type}}', description: 'Discount type (percentage/fixed)' },
        { key: '{{discount.value}}', description: 'Discount value' },
        { key: '{{discount.description}}', description: 'Discount description' },

        { key: '{{system.resetLink}}', description: 'Password reset link' }
    ];
};
