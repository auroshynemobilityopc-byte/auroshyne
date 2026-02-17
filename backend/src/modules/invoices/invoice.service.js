const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Booking = require('../bookings/booking.model');
const { AppError } = require('../../common/utils/appError');

// Use /tmp in serverless environments (AWS Lambda), local temp dir otherwise
const isServerless = __dirname.startsWith('/var/task');
const TEMP_DIR = isServerless
    ? '/tmp/invoices'
    : path.join(__dirname, '../../../temp/invoices');

// Ensure directory exists
try {
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
} catch (error) {
    console.error('Failed to create invoices directory:', error);
    // Directory will be created on-demand during invoice generation if needed
}

exports.generateInvoice = async (bookingId) => {
    const booking = await Booking.findOne({ bookingId })
        .populate('vehicles.serviceId', 'name price')
        .populate('vehicles.addons', 'name price')
        .lean();

    if (!booking) throw new AppError('Booking not found', 404);

    /**
     * 🧾 BUILD INVOICE DATA OBJECT
     */
    const invoiceData = {
        invoiceNumber: `INV-${booking.bookingId}`,
        bookingId: booking.bookingId,
        date: booking.date,
        slot: booking.slot,
        customer: {
            name: booking.customer.name,
            mobile: booking.customer.mobile,
            address: booking.customer.address,
            apartmentName: booking.customer.apartmentName || undefined,
        },
        vehicles: booking.vehicles.map((v) => ({
            number: v.number,
            type: v.type,
            model: v.model,
            service: {
                name: v.serviceId?.name,
                price: v.serviceId?.price,
            },
            addons:
                v.addons?.map((a) => ({
                    name: a.name,
                    price: a.price,
                })) || [],
            price: v.price,
        })),
        subtotal: booking.totalAmount + booking.discount,
        discount: booking.discount,
        totalAmount: booking.totalAmount,
        payment: {
            method: booking.payment?.method,
            status: booking.payment?.status,
            transactionId: booking.payment?.transactionId,
        },
        status: booking.status,
        generatedAt: new Date().toISOString(),
    };

    /**
     * 📄 GENERATE PDF
     */
    const fileName = `invoice-${booking.bookingId}.pdf`;
    const filePath = path.join(TEMP_DIR, fileName);

    // Ensure directory exists before writing
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Car Wash Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice No: ${invoiceData.invoiceNumber}`);
    doc.text(`Booking ID: ${invoiceData.bookingId}`);
    doc.text(`Date: ${invoiceData.date}`);
    doc.text(`Slot: ${invoiceData.slot}`);
    doc.moveDown();

    doc.text('Customer Details');
    doc.text(`Name: ${invoiceData.customer.name}`);
    doc.text(`Mobile: ${invoiceData.customer.mobile}`);
    doc.text(`Address: ${invoiceData.customer.address}`);
    if (invoiceData.customer.apartmentName) {
        doc.text(`Apartment: ${invoiceData.customer.apartmentName}`);
    }
    doc.moveDown();

    doc.text('Service Breakdown', { underline: true });
    doc.moveDown();

    invoiceData.vehicles.forEach((v, index) => {
        doc.text(`Vehicle ${index + 1}: ${v.number} (${v.type})`);
        doc.text(`Service: ${v.service.name} - ₹${v.service.price}`);

        if (v.addons?.length) {
            doc.text('Add-ons:');
            v.addons.forEach((a) => {
                doc.text(`  - ${a.name} ₹${a.price}`);
            });
        }

        doc.text(`Vehicle Total: ₹${v.price}`);
        doc.moveDown();
    });

    doc.moveDown();
    doc.text(`Subtotal: ₹${invoiceData.subtotal}`);
    doc.text(`Discount: ₹${invoiceData.discount}`);
    doc.text(`Total Amount: ₹${invoiceData.totalAmount}`, {
        underline: true,
    });

    doc.moveDown();
    doc.text(`Payment Status: ${invoiceData.payment.status}`);

    doc.end();

    await new Promise((resolve) => stream.on('finish', resolve));

    /**
     * 📥 DOWNLOAD URL
     */
    const downloadUrl = `/invoices/download/${fileName}`;

    return {
        ...invoiceData,
        downloadUrl,
    };
};
