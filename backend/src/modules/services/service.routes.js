const router = require('express').Router();

const serviceController = require('./service.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

/**
 * 🔐 ALL ROUTES REQUIRE LOGIN
 */
router.use(protect);

/**
 * 🟢 CUSTOMER + ADMIN (READ ONLY)
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Services fetched successfully
 */
router.get('/', allowRoles(CUSTOMER, ADMIN), serviceController.getServices);

/**
 * @swagger
 * /services/vehicleType/{vehicleType}:
 *   get:
 *     summary: Get service by vehicle type
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: vehicleType
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service fetched successfully
 */
router.get('/vehicleType/:vehicleType', allowRoles(CUSTOMER, ADMIN), serviceController.getServiceByVehicleType);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service fetched successfully
 */
router.get('/:id', allowRoles(CUSTOMER, ADMIN), serviceController.getServiceById);

/**
 * 🔒 ADMIN ONLY (WRITE)
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: Full Wash
 *               description:
 *                 type: string
 *                 example: Complete interior and exterior cleaning
 *               price:
 *                 type: number
 *                 example: 500
 *               duration:
 *                 type: number
 *                 example: 60
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post('/', allowRoles(ADMIN), serviceController.createService);

/**
 * @swagger
 * /services/{id}:
 *   patch:
 *     summary: Update a service
 *     tags: [Services]
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
 *                 example: Premium Wash
 *               description:
 *                 type: string
 *                 example: Enhanced cleaning service
 *               price:
 *                 type: number
 *                 example: 750
 *               duration:
 *                 type: number
 *                 example: 90
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
router.patch('/:id', allowRoles(ADMIN), serviceController.updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 */
router.delete('/:id', allowRoles(ADMIN), serviceController.deleteService);

module.exports = router;
