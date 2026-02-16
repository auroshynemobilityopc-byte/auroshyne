const router = require('express').Router();

const userController = require('./user.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN, CUSTOMER } = require('../../common/constants/roles');

router.use(protect);

/**
 * 🟢 CUSTOMER + ADMIN → OWN PROFILE
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get('/me', allowRoles(ADMIN, CUSTOMER), userController.getMyProfile);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update my profile
 *     tags: [Users]
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
 *               mobile:
 *                 type: string
 *                 example: 9876543210
 *               email:
 *                 type: string
 *                 example: [EMAIL_ADDRESS]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch('/me', allowRoles(ADMIN, CUSTOMER), userController.updateMyProfile);

/**
 * 🔒 ADMIN ONLY → USER MANAGEMENT
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, mobile, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               mobile:
 *                 type: string
 *                 example: 9876543210
 *               email:
 *                 type: string
 *                 example: [EMAIL_ADDRESS]
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', allowRoles(ADMIN), userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get('/', allowRoles(ADMIN), userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 */
router.get('/:id', allowRoles(ADMIN), userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags: [Users]
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
 *               mobile:
 *                 type: string
 *                 example: 9876543210
 *               email:
 *                 type: string
 *                 example: [EMAIL_ADDRESS]
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch('/:id', allowRoles(ADMIN), userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:id', allowRoles(ADMIN), userController.deleteUser);

module.exports = router;
