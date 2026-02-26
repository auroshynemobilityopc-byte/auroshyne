const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;

const Booking = require('../bookings/booking.model');
const { AppError } = require('../../common/utils/appError');

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
     * 📄 GENERATE PDF AND UPLOAD TO CLOUDINARY
     */
    const fileName = `invoice-${booking.bookingId}`;

    const doc = new PDFDocument({ margin: 50 });

    const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                public_id: fileName,
                folder: 'invoices',
                format: 'pdf'
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        doc.pipe(stream);
    });

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
        doc.text(`Service: ${v.service.name || 'N/A'} - Rs.${v.service.price || 0}`);

        if (v.addons?.length) {
            doc.text('Add-ons:');
            v.addons.forEach((a) => {
                doc.text(`  - ${a.name} Rs.${a.price}`);
            });
        }

        doc.text(`Vehicle Total: Rs.${v.price}`);
        doc.moveDown();
    });

    doc.moveDown();
    doc.text(`Subtotal: Rs.${invoiceData.subtotal}`);
    doc.text(`Discount: Rs.${invoiceData.discount}`);
    doc.text(`Total Amount: Rs.${invoiceData.totalAmount}`, {
        underline: true,
    });

    doc.moveDown();
    doc.text(`Payment Status: ${invoiceData.payment.status}`);

    doc.end();

    const uploadResult = await uploadPromise;

    /**
     * 📥 DOWNLOAD URL
     */
    const downloadUrl = uploadResult.secure_url.replace('/upload/', '/upload/fl_attachment/');

    return {
        ...invoiceData,
        downloadUrl,
    };
};
