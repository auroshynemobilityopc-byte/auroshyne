const router = require('express').Router();

const technicianController = require('./technician.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN } = require('../../common/constants/roles');

router.use(protect);
router.use(allowRoles(ADMIN));

/**
 * @swagger
 * /technicians:
 *   post:
 *     summary: Create a new technician
 *     tags: [Technicians]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: [EMAIL_ADDRESS]
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Technician created successfully
 */
router.post('/', technicianController.createTechnician);

/**
 * @swagger
 * /technicians:
 *   get:
 *     summary: Get all technicians
 *     tags: [Technicians]
 *     responses:
 *       200:
 *         description: Technicians fetched successfully
 */
router.get('/', technicianController.getTechnicians);

/**
 * @swagger
 * /technicians/{id}:
 *   get:
 *     summary: Get technician by ID
 *     tags: [Technicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technician fetched successfully
 */
router.get('/:id', technicianController.getTechnicianById);

/**
 * @swagger
 * /technicians/{id}:
 *   patch:
 *     summary: Update a technician
 *     tags: [Technicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: [EMAIL_ADDRESS]
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Technician updated successfully
 */
router.patch('/:id', technicianController.updateTechnician);

/**
 * @swagger
 * /technicians/{id}:
 *   delete:
 *     summary: Delete a technician
 *     tags: [Technicians]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technician deleted successfully
 */
router.delete('/:id', technicianController.deleteTechnician);

module.exports = router;
