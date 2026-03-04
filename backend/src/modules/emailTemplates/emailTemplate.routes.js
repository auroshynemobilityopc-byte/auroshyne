const express = require('express');
const router = express.Router();
const templateController = require('./emailTemplate.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { allowRoles } = require('../../common/middleware/role.middleware');
const { ADMIN } = require('../../common/constants/roles');

router.use(protect);
router.use(allowRoles(ADMIN));

router.route('/')
    .get(templateController.getAllTemplates)
    .post(templateController.createTemplate);

router.route('/:id')
    .get(templateController.getTemplateById)
    .patch(templateController.updateTemplate)
    .delete(templateController.deleteTemplate);

module.exports = router;
