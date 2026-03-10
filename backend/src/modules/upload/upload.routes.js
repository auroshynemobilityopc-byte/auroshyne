const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');

const { ADMIN } = require('../../common/constants/roles');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, allowRoles(ADMIN), upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'carwash/gallery' },
        (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                return res.status(500).json({ success: false, message: 'Failed to upload image' });
            }
            res.json({ success: true, url: result.secure_url });
        }
    );

    stream.end(req.file.buffer);
});

module.exports = router;
